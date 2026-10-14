import { AsyncLocalStorage } from "node:async_hooks";
import { Kysely, CamelCasePlugin } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { type DB, kyselyIdentifierOverrides } from "./schema";

// kysely's CamelCasePlugin can't recover a snake_case name with an underscore directly before a digit;
// the generated schema lists those spellings.
class AppCamelCasePlugin extends CamelCasePlugin {
  protected override snakeCase(str: string): string {
    return kyselyIdentifierOverrides[str] ?? super.snakeCase(str);
  }
}

/**
 * On Cloudflare Workers a database connection can't be shared between requests,
 * so each API request gets its own connection (see functions/_api) and `db` points to it.
 */
const store = new AsyncLocalStorage<Kysely<DB>>();

export async function runWithDb<T>(url: string, keepAlive: (p: Promise<unknown>) => void, fn: () => Promise<T>): Promise<T> {
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: false, max: 1, idle_timeout: 5, connect_timeout: 10, fetch_types: false });
  const k = new Kysely<DB>({ plugins: [new AppCamelCasePlugin()], dialect: new PostgresJSDialect({ postgres: client }) });
  try {
    return await store.run(k, fn);
  } finally {
    keepAlive(client.end({ timeout: 5 }));
  }
}

export const db = new Proxy({} as Kysely<DB>, {
  get(_t, prop) {
    const k = store.getStore();
    if (!k) throw new Error("Database used outside a request");
    const v = (k as unknown as Record<string | symbol, unknown>)[prop];
    return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(k) : v;
  },
});

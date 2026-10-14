/** Secrets and settings set in Cloudflare Pages → Settings → Variables and Secrets. */
export type Env = {
  ASSETS: Fetcher;
  /** Supabase "Transaction pooler" connection string (port 6543) */
  DATABASE_URL: string;
  /** https://<project>.supabase.co */
  SUPABASE_URL: string;
  /** Supabase service_role key — server only, never sent to the browser */
  SUPABASE_SERVICE_ROLE_KEY: string;
  /** Long random string used to sign login sessions */
  JWT_SECRET: string;
  /** Resend API key for password-reset emails (optional) */
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
};

/** The endpoint code reads settings from process.env (as it did on Floot), so copy them in for each request. */
export function applyEnv(env: Env) {
  const g = globalThis as unknown as { process?: { env: Record<string, string> } };
  if (!g.process) g.process = { env: {} };
  for (const [k, v] of Object.entries(env)) if (typeof v === "string") g.process.env[k] = v;
  // names the original Floot code used
  if (env.DATABASE_URL) g.process.env.FLOOT_DATABASE_URL = env.DATABASE_URL;
}

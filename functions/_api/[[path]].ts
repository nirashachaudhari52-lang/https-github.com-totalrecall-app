import { routes } from "../_generated/apiRoutes";
import { runWithDb } from "../../helpers/db";
import { applyEnv, type Env } from "../_env";

/** All /_api/* requests: find the endpoint module and run it with a database connection for this request. */
export const onRequest: PagesFunction<Env> = async (ctx) => {
  applyEnv(ctx.env);
  const parts = ctx.params.path;
  const path = (Array.isArray(parts) ? parts : [parts]).filter(Boolean).join("/");
  const method = ctx.request.method === "HEAD" ? "GET" : ctx.request.method;
  const mod = routes[`${path}_${method}`];
  if (!mod) {
    return new Response(JSON.stringify({ json: { error: "Not found" } }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  return runWithDb(ctx.env.DATABASE_URL, (p) => ctx.waitUntil(p), async () => {
    const res = await mod.handle(ctx.request);
    if (!res.headers.has("Cache-Control")) {
      const h = new Headers(res.headers);
      h.set("Cache-Control", "no-store");
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  });
};

import type { Env } from "../../_env";

/**
 * /_cdn/static/<file>: served from the site's own files when present (sample pages, icons),
 * otherwise from the Supabase Storage bucket "static" (images the author uploads from the panel).
 */
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const own = await ctx.env.ASSETS.fetch(ctx.request);
  if (own.status !== 404) return own;
  const parts = ctx.params.path;
  const key = (Array.isArray(parts) ? parts : [parts]).map(encodeURIComponent).join("/");
  const upstream = await fetch(`${ctx.env.SUPABASE_URL}/storage/v1/object/public/static/${key}`, {
    cf: { cacheEverything: true, cacheTtl: 86400 * 30 },
  } as RequestInit);
  if (!upstream.ok) return new Response("Not found", { status: 404 });
  const h = new Headers(upstream.headers);
  h.set("Cache-Control", "public, max-age=2592000, immutable");
  h.delete("set-cookie");
  return new Response(upstream.body, { status: 200, headers: h });
};

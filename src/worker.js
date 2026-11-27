// Total Recall – college site Worker
// Serves college.totalrecallofficial.com (custom domain) and totalrecallofficial.com/bsc/data/* (Workers Route).
//
// 1. /bsc/data/<file> is the same file as /college/data/<file>.
//    The Total Recall app's B.Sc page (totalrecallofficial.com/bsc/) loads its questions from /bsc/data/.
//    A Workers Route on the totalrecallofficial.com zone sends */bsc/data/* to this Worker, so the app and
//    the college site always show the same question bank: the files in public/college/data/ on this branch.
// 2. /college/ on the college site shows the app's own B.Sc page (fetched from the app), so the questions'
//    colours and layout always match the app. Links that lead back to the app point to totalrecallofficial.com.
//    If the app page can't be fetched, public/college/index.html is served instead.
// Everything else is served from ./public as static assets (see wrangler.jsonc, assets.run_worker_first).

const APP_HOME = "https://totalrecallofficial.com/";
const APP_BSC_PAGE = "https://totalrecall-app.pages.dev/bsc/";

const PAGE_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=0, must-revalidate",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "SAMEORIGIN",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Question data for the app's B.Sc page (and for the app page shown on the college site)
    if (url.pathname.startsWith("/bsc/data/")) {
      url.pathname = "/college/data/" + url.pathname.slice("/bsc/data/".length);
      return env.ASSETS.fetch(new Request(url, request));
    }

    // On the college site the question bank lives at /college/
    if (url.pathname === "/bsc" || url.pathname === "/bsc/") {
      return Response.redirect(new URL("/college/" + url.search, url).toString(), 301);
    }

    if (url.pathname === "/college/" || url.pathname === "/college/index.html") {
      const page = await appBscPage();
      if (page) return page;
    }

    return env.ASSETS.fetch(request);
  },
};

// The app's B.Sc page, with its links back to the app pointed at totalrecallofficial.com
async function appBscPage() {
  let res;
  try {
    res = await fetch(APP_BSC_PAGE, { cf: { cacheTtl: 300, cacheEverything: true } });
  } catch {
    return null;
  }
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.includes("text/html")) return null;

  return new HTMLRewriter()
    .on("a.switch", { element: (a) => a.setAttribute("href", APP_HOME) })
    .on(".foot a", { element: (a) => a.setAttribute("href", APP_HOME) })
    .on('link[rel="manifest"]', { element: (el) => el.remove() })
    .on('script[src*="cloudflareinsights"]', { element: (el) => el.remove() })
    .transform(new Response(res.body, { status: 200, headers: PAGE_HEADERS }));
}

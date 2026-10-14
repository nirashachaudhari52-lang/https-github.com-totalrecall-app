import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../base.css";
import { GlobalContextProviders } from "../components/_globalContextProviders";
import { NotFound } from "./NotFound";

/**
 * File-based routing, matching how the app was organised on Floot:
 *   pages/_index.tsx            → /
 *   pages/quizzes.$subjectId.tsx → /quizzes/:subjectId
 *   pages/<name>.pageLayout.tsx  → array of wrapper components around that page
 */
type Wrapper = React.ComponentType<{ children: React.ReactNode }>;

const pageModules = import.meta.glob<{ default: React.ComponentType }>(["../pages/*.tsx", "!../pages/*.pageLayout.tsx", "!../pages/*.example.tsx", "!../pages/*.__example.tsx"]);
const layoutModules = import.meta.glob<{ default: Wrapper[] }>("../pages/*.pageLayout.tsx", { eager: true });

function routeName(file: string) {
  return file.replace(/^.*\/pages\//, "").replace(/\.tsx$/, "");
}

export function toPath(name: string) {
  if (name === "_index") return "/";
  const segs = name
    .replace(/\[\.\]/g, "\u0000")
    .split(".")
    .map((s) => s.replace(/\u0000/g, "."))
    .map((s) => (s === "$" ? "*" : s.startsWith("$") ? `:${s.slice(1)}` : s));
  return "/" + segs.join("/");
}

const routes = Object.entries(pageModules).map(([file, load]) => {
  const name = routeName(file);
  const Page = lazy(load);
  const wrappers = layoutModules[`../pages/${name}.pageLayout.tsx`]?.default ?? [];
  const element = wrappers.reduceRight<React.ReactNode>(
    (child, W) => <W>{child}</W>,
    <Suspense fallback={null}>
      <Page />
    </Suspense>,
  );
  return { path: toPath(name), element, static: !name.includes("$") };
});
// static paths first so /mock-test wins over /mock-test/:attemptId style matches
routes.sort((a, b) => Number(b.static) - Number(a.static));

function App() {
  return (
    <BrowserRouter>
      <GlobalContextProviders>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

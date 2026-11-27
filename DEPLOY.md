# Deploy guide – Total Recall start page + B.Sc Nursing college question bank (Semesters I–VII)

This package is a **finished static website**. Nothing needs to be built, installed or generated –
deploy the `public/` folder as it is. These instructions are written for the person or Claude
assistant doing the deployment.

## Live setup (since 27 Nov 2026)

- **One question bank for the app and the college site.** Both show the data in `public/college/data/`
  on branch `college-site`. Push new data there and both update in about 2 minutes.
- **Total Recall app** – https://totalrecallofficial.com/bsc/ is the app's own B.Sc page (it lives in the
  app's repository). A Workers Route on the `totalrecallofficial.com` zone sends
  `*totalrecallofficial.com/bsc/data/*` to this Worker, which answers `/bsc/data/<file>` with
  `public/college/data/<file>` (`src/worker.js`).
- **College site** – https://college.totalrecallofficial.com: `/` is the start page; `/college/` shows the
  app's B.Sc page (fetched from https://totalrecall-app.pages.dev/bsc/, cached 5 minutes), so the questions
  look exactly like the app. `public/college/index.html` is only a fallback if the app page can't be fetched.
- The question page design therefore lives in the app's repository. If the data format changes (new fields
  such as diagrams), the app's `/bsc/` page has to be updated to show them.

## 1. What is inside

```
total-recall-college-site/
├── DEPLOY.md            this guide
├── README.md            contents table (subjects, question counts)
├── wrangler.jsonc       Cloudflare Worker config (Worker name "https-github-com-totalrecall-app")
├── src/worker.js        /bsc/data/* = /college/data/*; /college/ shows the app's B.Sc page
└── public/              THE WEBSITE – deploy this folder
    ├── index.html       start page: "College students" | "Competitive exams"
    ├── college/
    │   ├── index.html   B.Sc Nursing question bank (semester → subject → unit, filters, search)
    │   └── data/        index.json, syllabus.json and one JSON file per subject (s1-anat-105.json …)
    ├── 404.html, favicon.svg, robots.txt
    └── _headers         security headers + short cache for the data files
```

- **Start page (`/`)** – two cards. *College students* opens `/college/`. *Competitive exams* opens
  **https://totalrecallofficial.com** (the existing Total Recall app). To change that link, edit the
  `href` of `<a class="path comp" …>` in `public/index.html`.
- **College question bank (`/college/`)** – B.Sc Nursing, INC 2021 syllabus, university-style
  descriptive answers (2, 5, 10, 15 marks), previous-year questions (PYQ) marked. Each subject's JSON
  is loaded only when a student opens that subject, so the page stays light on mobile data.
- **Content in this package:** Semesters I to VII complete (all theory semesters; Semester VIII is the
  internship) – 30 subjects, 3,246 questions (589 previous-year). Diagrams follow later as an update
  (a new package or a push to the `college-site` branch). See `README.md` for exact counts.

Apart from the small `src/worker.js`, the site needs **no server code, no database and no environment
variables**. All paths are absolute (`/college/…`), so `public/` must be served at the root of a domain or subdomain.

## 2. Deployment options (pick ONE)

### Option A – Cloudflare Worker with static assets, from a terminal
1. Unzip the package and open a terminal in `total-recall-college-site/` (the folder containing `wrangler.jsonc`).
2. Log in to Cloudflare: `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`).
   Use the Cloudflare account that owns the Worker named in `wrangler.jsonc`.
3. Deploy: `npx wrangler deploy`
   - The Worker name comes from `"name"` in `wrangler.jsonc` (now `https-github-com-totalrecall-app`,
     the Worker already connected to GitHub). To deploy under another name, change `"name"` first.
4. Wrangler prints the `*.workers.dev` URL. Optional: Worker → Settings → Domains & Routes → add a
   custom domain or subdomain (for example `study.totalrecallofficial.com`).

### Option B – Cloudflare Pages, upload from the dashboard (no terminal)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets** (direct upload).
2. Give the project a name, then upload the **contents of the `public/` folder** (drag the folder in,
   or zip only the contents of `public/` and upload that zip).
3. Deploy. The site appears at `https://<project-name>.pages.dev`; add a custom domain if wanted.
   (Or from a terminal: `npx wrangler pages deploy public --project-name <project-name>`.)

### Option C – GitHub-connected auto-deploy (in use)
The same site is committed on branch **`college-site`** of GitHub repo
**nirashachaudhari52-lang/https-github.com-totalrecall-app** (root contains `wrangler.jsonc` and `public/`).
This repository is connected in Workers Builds to the Worker **`https-github-com-totalrecall-app`**
(production branch **`college-site`**, root directory `/`, build command empty, deploy command
`npx wrangler deploy`). Every push to `college-site` deploys automatically.
**Important:** Workers Builds only deploys when `"name"` in `wrangler.jsonc` is exactly the name of the
connected Worker. If you connect the repository to a different Worker (for example `total-recall`),
change `"name"` to that Worker's name, or every build fails.

### Option D – Add it inside the main Total Recall app (if you have the app's code)
1. Copy `public/college/` into the app's public/static folder so that it is served at **`/college/`**
   (the page fetches `/college/data/index.json`, `/college/data/syllabus.json` and
   `/college/data/<subject>.json`). If it must live at another path, change the constant
   `DATA_URL` near the top of the `<script>` in `college/index.html` and the "‹ Start page" link.
2. Add an entry point for students: either serve `public/index.html` as the app's start page (and point its
   *Competitive exams* card to the app's existing home route instead of totalrecallofficial.com), or add a
   "College students – B.Sc Nursing question bank" button/menu item that links to `/college/`.
3. Make sure the app's router/service worker does not intercept `/college/*` (it must return the static files).

## 3. Check after deploying
1. `/` shows the two cards; the college card shows the question count (read from `/college/data/index.json`).
2. `/college/` loads in the app's design; tap Sem 1 → Sem 7 and several subjects – questions appear; tap a question to open the answer.
3. Semester link works: `/college/#sem7` opens Semester 7.
4. https://totalrecallofficial.com/bsc/ (the app) shows the same semesters and question counts.
5. *Competitive exams* opens https://totalrecallofficial.com (or the route you set).
6. An unknown address (e.g. `/xyz`) shows the "Page not found" page.

## 4. Updating later
New semesters arrive as a push to the `college-site` branch: replace `public/college/data/` and push.
The app and the college site both pick it up. Do not edit
the JSON by hand – it is generated from the question-bank sources. `index.json` carries a `version`
string that the page uses to fetch fresh data.

## 5. Data format (for importing into a database, if ever needed)
`index.json` → `{generated, version, totals, courses:[{sem, code, slug, subject, count, pyq, marks,
units_ready, units_total, words, bytes}]}`.
Each subject file is an array of questions:
`{id, semester, course_code, subject, unit_no, unit_title, marks, question, is_pyq, pyq_sources[],
tags[], diagram:{caption, labels[]} | null, answer_html, word_count}`.
`id` is stable, e.g. `S4-NAHNII225-U06-001` (semester, course, unit, number).

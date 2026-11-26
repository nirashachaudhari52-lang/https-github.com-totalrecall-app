# Deploy guide – Total Recall start page + B.Sc Nursing college question bank (Semesters I–VII)

This package is a **finished static website**. Nothing needs to be built, installed or generated –
deploy the `public/` folder as it is. These instructions are written for the person or Claude
assistant doing the deployment.

## 1. What is inside

```
total-recall-college-site/
├── DEPLOY.md            this guide
├── README.md            contents table (subjects, question counts)
├── wrangler.jsonc       Cloudflare Worker config (static assets only, Worker name "total-recall")
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

The site needs **no server code, no database and no environment variables**. All paths are absolute
(`/college/…`), so `public/` must be served at the root of a domain or subdomain.

## 2. Deployment options (pick ONE)

### Option A – Cloudflare Worker with static assets (recommended; matches the existing Worker "total-recall")
1. Unzip the package and open a terminal in `total-recall-college-site/` (the folder containing `wrangler.jsonc`).
2. Log in to Cloudflare: `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`).
   Use the Cloudflare account that owns the Worker **total-recall**.
3. Deploy: `npx wrangler deploy`
   - This replaces the current "Hello world" code of Worker `total-recall` with this site.
   - To deploy under another name, change `"name"` in `wrangler.jsonc` first.
4. Wrangler prints the `*.workers.dev` URL. Optional: Worker → Settings → Domains & Routes → add a
   custom domain or subdomain (for example `study.totalrecallofficial.com`).

### Option B – Cloudflare Pages, upload from the dashboard (no terminal)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets** (direct upload).
2. Give the project a name, then upload the **contents of the `public/` folder** (drag the folder in,
   or zip only the contents of `public/` and upload that zip).
3. Deploy. The site appears at `https://<project-name>.pages.dev`; add a custom domain if wanted.
   (Or from a terminal: `npx wrangler pages deploy public --project-name <project-name>`.)

### Option C – GitHub-connected auto-deploy (already prepared)
The same site is already committed on branch **`college-site`** of GitHub repo
**nirashachaudhari52-lang/https-github.com-totalrecall-app** (root contains `wrangler.jsonc` and `public/`).
Cloudflare dashboard → Workers & Pages → **total-recall** → Settings → **Build** → Connect → GitHub →
that repo → production branch **`college-site`**, root directory `/`, build command empty,
deploy command `npx wrangler deploy`. Every later push to `college-site` then deploys automatically.

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
2. `/college/` loads; tap Sem 1 → Sem 7 and several subjects – questions appear; tap a question to open the answer.
3. Deep link works: `/college/#s4-n-ahn-ii-225/S4-NAHNII225-U06-001` opens Adult Health Nursing II, Unit 6, first question; `/college/#s5-n-comh-i-310` opens Community Health Nursing I; `/college/#s6-n-midw-i-obgn-335` opens Midwifery/OBG Nursing I; `/college/#s7-n-comh-ii-401/S7-NCOMHII401-U01-001` opens the first Community Health Nursing II question.
4. *Competitive exams* opens https://totalrecallofficial.com (or the route you set).
5. An unknown address (e.g. `/xyz`) shows the "Page not found" page.

## 4. Updating later
New semesters arrive as a new package (or a push to the `college-site` branch). To update, replace
`public/college/data/` (and `public/college/index.html` if it changed) and deploy again. Do not edit
the JSON by hand – it is generated from the question-bank sources. `index.json` carries a `version`
string that the page uses to fetch fresh data.

## 5. Data format (for importing into a database, if ever needed)
`index.json` → `{generated, version, totals, courses:[{sem, code, slug, subject, count, pyq, marks,
units_ready, units_total, words, bytes}]}`.
Each subject file is an array of questions:
`{id, semester, course_code, subject, unit_no, unit_title, marks, question, is_pyq, pyq_sources[],
tags[], diagram:{caption, labels[]} | null, answer_html, word_count}`.
`id` is stable, e.g. `S4-NAHNII225-U06-001` (semester, course, unit, number).

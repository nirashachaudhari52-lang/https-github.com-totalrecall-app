# Total Recall – start page and B.Sc Nursing college question bank

This branch (`college-site`) holds the B.Sc Nursing (INC 2021) question bank – 2, 5, 10 and 15-mark
answers, previous-year questions (PYQ) marked – for both the Total Recall app and the college site
(Cloudflare Worker **https-github-com-totalrecall-app**, see `DEPLOY.md` → *Live setup*):

- **App:** https://totalrecallofficial.com/bsc/ loads its questions from `/bsc/data/`, which a Workers Route
  sends to this Worker (`src/worker.js` answers it with `public/college/data/`).
- **College site:** https://college.totalrecallofficial.com – `/` start page (**College students** → question
  bank; **Competitive exams** → https://totalrecallofficial.com); `/college/` shows the app's own B.Sc page,
  so the questions look the same as in the app. Each subject loads from `public/college/data/<subject>.json`.

## Deployment (Cloudflare Workers Builds)

Worker **https-github-com-totalrecall-app** → Settings → Builds: Git repository this repo,
**production branch `college-site`**, root directory `/`, no build command, deploy command `npx wrangler deploy`.
Every push to this branch deploys automatically. Pushes to any other branch run the preview command
(`npx wrangler preview`) and do not deploy. `wrangler.jsonc` serves `./public` as static assets plus
`src/worker.js`; its `"name"` must stay the Worker's name. Custom domain: `college.totalrecallofficial.com`
and route `*totalrecallofficial.com/bsc/data/*` (Worker → Domains); the workers.dev address is switched off.

## Contents (2026-11-26, data version 8c87312058b8)

3246 questions, 589 previous-year questions, 30 subjects.

| Sem | Code | Subject | Questions | PYQ | Units ready |
|---|---|---|---|---|---|
| 1 | ENGL 101 | Communicative English | 80 | 0 | 7 of 7 |
| 1 | ANAT 105 | Applied Anatomy | 212 | 32 | 10 of 10 |
| 1 | PHYS 110 | Applied Physiology | 181 | 30 | 11 of 11 |
| 1 | SOCI 115 | Applied Sociology | 78 | 22 | 7 of 7 |
| 1 | PSYC 120 | Applied Psychology | 98 | 22 | 10 of 10 |
| 1 | N-NF (I) 125 | Nursing Foundation I (including First Aid module) | 147 | 30 | 14 of 14 |
| 2 | BIOC 135 | Applied Biochemistry | 91 | 23 | 8 of 8 |
| 2 | NUTR 140 | Applied Nutrition and Dietetics | 145 | 50 | 13 of 13 |
| 2 | N-NF (II) 125 | Nursing Foundation II (including Health Assessment module) | 185 | 32 | 16 of 16 |
| 2 | HNIT 145 | Health/Nursing Informatics and Technology | 94 | 1 | 10 of 10 |
| 3 | MICR 201 | Applied Microbiology and Infection Control including Safety | 145 | 61 | 15 of 15 |
| 3 | PHAR (I) 205 | Pharmacology I | 70 | 24 | 8 of 8 |
| 3 | PATH (I) 210 | Pathology I | 56 | 19 | 3 of 3 |
| 3 | N-AHN (I) 215 | Adult Health Nursing I with integrated pathophysiology (including BCLS module) | 187 | 50 | 11 of 11 |
| 4 | PHAR (II) 205 | Pharmacology II (including Fundamentals of Prescribing module) | 92 | 20 | 8 of 8 |
| 4 | PATH (II) 210 | Pathology II and Genetics | 69 | 17 | 7 of 7 |
| 4 | N-AHN (II) 225 | Adult Health Nursing II with integrated pathophysiology including Geriatric Nursing (and Palliative Care module) | 198 | 55 | 12 of 12 |
| 4 | PROF 230 | Professionalism, Professional Values and Ethics including Bioethics | 44 | 0 | 3 of 3 |
| 5 | N-CHN (I) 301 | Child Health Nursing I (including ENBC, FBNC, IMNCI and PLS modules) | 109 | 8 | 6 of 6 |
| 5 | N-MHN (I) 305 | Mental Health Nursing I | 95 | 13 | 8 of 8 |
| 5 | N-COMH (I) 310 | Community Health Nursing I including Environmental Science & Epidemiology | 120 | 25 | 11 of 11 |
| 5 | EDUC 315 | Educational Technology / Nursing Education | 78 | 23 | 8 of 8 |
| 5 | N-FORN 320 | Introduction to Forensic Nursing and Indian Laws | 30 | 1 | 5 of 5 |
| 6 | N-CHN (II) 301 | Child Health Nursing II | 95 | 2 | 3 of 3 |
| 6 | N-MHN (II) 305 | Mental Health Nursing II | 75 | 15 | 7 of 7 |
| 6 | NMLE 330 | Nursing Management and Leadership | 114 | 0 | 18 of 18 |
| 6 | N-MIDW (I)/OBGN 335 | Midwifery/Obstetrics and Gynaecology (OBG) Nursing I (including SBA module) | 93 | 1 | 7 of 7 |
| 7 | N-COMH (II) 401 | Community Health Nursing II | 107 | 12 | 13 of 13 |
| 7 | NRST 405 | Nursing Research and Statistics | 66 | 1 | 8 of 8 |
| 7 | N-MIDW (II)/OBGN 410 | Midwifery/Obstetrics and Gynaecology (OBG) Nursing II (including Safe Delivery App module) | 92 | 0 | 5 of 5 |

The files in `public/college/data/` are generated from the question-bank sources; edit those sources and
regenerate rather than editing the JSON by hand.

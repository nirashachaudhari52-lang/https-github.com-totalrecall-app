# Total Recall – start page and B.Sc Nursing college question bank

This branch (`college-site`) is a static website deployed to the Cloudflare Worker **total-recall**.

- `/` – start page: **College students** → B.Sc Nursing question bank; **Competitive exams** → https://totalrecallofficial.com
- `/college/` – B.Sc Nursing (INC 2021) semester-wise question bank with 2, 5, 10 and 15-mark answers;
  previous-year questions (PYQ) are marked. Each subject loads from `public/college/data/<subject>.json`.

## Deployment (Cloudflare Workers Builds)

Worker **total-recall** → Settings → Build → Git repository: this repo, production branch **college-site**,
root directory `/`, deploy command `npx wrangler deploy` (no build command needed). Every push to this
branch deploys automatically. `wrangler.jsonc` serves `./public` as static assets.

## Contents (2026-11-19, data version 73fc8ead15c0)

2603 questions, 544 previous-year questions, 23 subjects.

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
| 2 | N-NF (II) 125 | Nursing Foundation II (including Health Assessment module) | 185 | 31 | 16 of 16 |
| 2 | HNIT 145 | Health/Nursing Informatics and Technology | 94 | 0 | 10 of 10 |
| 3 | MICR 201 | Applied Microbiology and Infection Control including Safety | 145 | 61 | 15 of 15 |
| 3 | PHAR (I) 205 | Pharmacology I | 70 | 23 | 8 of 8 |
| 3 | PATH (I) 210 | Pathology I | 56 | 19 | 3 of 3 |
| 3 | N-AHN (I) 215 | Adult Health Nursing I with integrated pathophysiology (including BCLS module) | 187 | 50 | 11 of 11 |
| 4 | PHAR (II) 205 | Pharmacology II (including Fundamentals of Prescribing module) | 92 | 20 | 8 of 8 |
| 4 | PATH (II) 210 | Pathology II and Genetics | 69 | 17 | 7 of 7 |
| 4 | N-AHN (II) 225 | Adult Health Nursing II with integrated pathophysiology including Geriatric Nursing (and Palliative Care module) | 198 | 55 | 12 of 12 |
| 4 | PROF 230 | Professionalism, Professional Values and Ethics including Bioethics | 44 | 0 | 3 of 3 |
| 5 | N-CHN (I) 301 | Child Health Nursing I (including ENBC, FBNC, IMNCI and PLS modules) | 109 | 8 | 6 of 6 |
| 5 | N-MHN (I) 305 | Mental Health Nursing I | 94 | 6 | 8 of 8 |
| 5 | N-COMH (I) 310 | Community Health Nursing I including Environmental Science & Epidemiology | 120 | 22 | 11 of 11 |
| 5 | EDUC 315 | Educational Technology / Nursing Education | 78 | 23 | 8 of 8 |
| 5 | N-FORN 320 | Introduction to Forensic Nursing and Indian Laws | 30 | 0 | 5 of 5 |

The files in `public/college/data/` are generated from the question-bank sources; edit those sources and
regenerate rather than editing the JSON by hand.

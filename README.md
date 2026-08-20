# Varsity College Rugby — website

A single-page advocacy and proposal microsite for moving collegiate rugby from
club status to sanctioned **varsity** status. Static HTML, CSS, and vanilla
JavaScript — no build step, no framework, no dependencies.

Everything you'll want to change lives in the **`data/`** folder as plain JSON.
You should not need to touch the HTML, CSS, or JavaScript to fill in the site.

---

## Running and previewing it

Because the site loads JSON with `fetch()`, you can't just double-click
`index.html` — browsers block `fetch` from `file://`. Run a tiny local server:

```bash
cd varsity-college-rugby
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Any change you make to a JSON
file shows up on reload.

## Publishing it

The site is fully static, so it deploys to **Netlify**, **Vercel**, or **GitHub
Pages** as-is. A `netlify.toml` is included with sensible defaults and a
`/proposal` redirect that points at the PDF (see *The full proposal PDF* below).
Drag the folder into Netlify, or connect the repo — there is no build command.

---

## Editing the content

All files are in `data/`. Open them in any text editor. They're JSON, so:

- Keep the quotes `"like this"` around text.
- Separate items with commas.
- A value of `null` (no quotes) means **"no data yet."** The site is built to
  **hide** anything that is `null` rather than show a blank or a fake number.

> **The golden rule:** a missing number disappears from the page. It never shows
> as `$0`, because a cost of zero and a cost you haven't filled in yet mean very
> different things to the athletic directors reading this.

### `config.json` — names, contact, links

| Field | What it does |
|---|---|
| `siteName` | Full name — shown in the nav wordmark and the footer. |
| `shortName` | Short abbreviation, kept for metadata; not shown in the nav. |
| `scope` | `"national"`, `"state"`, `"conference"`, or `"institution"`. |
| `launchTerm` | e.g. `"Fall 2028"`, or `null`. |
| `contactEmail` | Shown in the form section and footer. Empty = hidden. |
| `parentOrg` | Parent organization credit in the footer. Empty = hidden. |
| `formEmbedUrl` | The Google Form **embed** URL (see *The form* below). |
| `formDirectUrl` | The normal Google Form link, for the "open in new tab" fallback. |
| `proposalPdfUrl` | Link to the full proposal PDF. Empty = the "Read the full proposal" button hides itself. |
| `hero.eyebrow` / `hero.headline` / `hero.subhead` | The big text at the top. `headline` is a list — each item is one line. |

### `why.json` — "Why this will work"

Four `pillars`, each with a `title`, `body`, and an `icon` (one of `cost`,
`barrier`, `demand`, `support`). This is where the old long barriers list now
lives — condensed to a single "Barriers to entry" pillar.

### `momentum.json` — "A sport on the rise" (the logos)

A list of `subjects`, each with a `logo` image path, `alt` text, a `body`
sentence, and `wide: true` for wider logos. Logos live in `assets/img/`. A few of
these sentences make governance claims (NCAA status, varsity program count) —
confirm them against a current source before publishing (see the checklist below).

### `phases.json` — the launch timeline ("Timeline")

Each entry is a milestone shown along the timeline: `term` (the date, shown large
in oxblood, e.g. `"By April 2027"`) and `title` (the milestone beneath it). Add or
remove milestones by editing the list.

### `budget.json` — the example budget ("What it costs")

The budget is an **illustrative example** of a first-year program (mostly people,
very little capital) that any college can adapt — not a fixed price.

- **`intro`** — the sentence under the heading framing it as an example.
- **`example`** — the line-item table. `label` is the caption; each `lineItems`
  entry has a `label`, an `amount` (plain number, **no** `$` or commas — `52000`,
  not `"$52,000"`; `0` is a real zero and shows as `$0`; `null` shows a dash), and
  an optional `note`. `total` is the Year 1 total and `totalNote` is the grey line
  beneath it.
- **`highlights`** — the three financial callouts below the table, each a `label`
  and a `body`.

To swap in your own institution's numbers, edit the `amount` values and `total`.

### `faq.json` — the FAQ accordion

A list of `{ "q": "...", "a": "..." }` pairs — the question and its answer. Add,
remove, or reword freely.

---

## The form ("Get involved")

The sign-up form is a **Google Form** embedded on the page.

1. Build your form in Google Forms.
2. Click **Send → `< >` (embed)** and copy the `src="..."` URL from the code it
   gives you. Paste that into `formEmbedUrl` in `config.json`.
3. Also copy the normal shareable link (**Send → link**) into `formDirectUrl`.
   That powers the "Open the form in a new tab" fallback for anyone whose
   browser blocks embeds.

Until `formEmbedUrl` is set, the section shows a small "Form not yet configured"
placeholder — that's expected.

## The full proposal PDF

1. Put the PDF at `assets/docs/proposal.pdf`.
2. Set `"proposalPdfUrl": "/assets/docs/proposal.pdf"` in `config.json`.

The "Read the full proposal" buttons and the `/proposal` short link then work.
While `proposalPdfUrl` is empty, those buttons hide themselves.

---

## Before you go live — the verification checklist

A few statements make governance claims that change over time. They now read as
plain sentences (no visible editor notes), so confirm each against a current
source — or soften it — before publishing:

- [ ] Governing body and competition structure for collegiate rugby (`faq.json`,
      "Where would our team compete?")
- [ ] NCAA emerging-sport status and championship pathway (`momentum.json`)
- [ ] Varsity program count — "more than 50 colleges" (`momentum.json`)
- [ ] The example budget figures in `budget.json` reflect your own institution
- [ ] Contact email, parent org, form URLs, and proposal PDF in `config.json`

---

## File map (for the curious)

```
index.html            The page structure. Rarely needs editing.
styles/               Design tokens and CSS. Colors and fonts live in tokens.css.
scripts/              The JavaScript that reads data/ and fills the page.
data/                 ← You edit these. All content and numbers.
assets/img/           Images you supply.
assets/docs/          The proposal PDF.
netlify.toml          Hosting config + the /proposal redirect.
```

Questions about the numbers or copy go to whoever owns the initiative. Questions
about the build itself: everything is plain HTML/CSS/JS with comments.

/* config-loader.js — hydrates config, the ask (phases), how-easy-to-play,
   why-this-will-work, a-sport-on-the-rise, safety, form, faq, and footer
   from JSON. Empty-state-correct: a missing value hides its slot rather
   than showing a placeholder. */

import { loadData, getPath } from "./data.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

/* Inline SVG icons for the "Why this will work" pillars, keyed by name. */
const ICONS = {
  cost: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 2 3 2 3 .9 3 2-1.34 2-3 2-3-.9-3-2"/>',
  barrier: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  demand: '<path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 20v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  support: '<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
};
const iconSvg = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.support}</svg>`;

/* Safety commitments are fixed structural copy, not owner data. */
const SAFETY = [
  { title: "Medical coverage and concussion protocol", body: "A defined standard of medical coverage for every match, plus an adopted, written concussion protocol governing removal, assessment, and return to play — enforced by trained match-day staff." },
  { title: "Certified coaching and technique", body: "Every coach holds a current certification through an approved pathway, and coaching to defined tackle-height and technique standards is required from day one. Certification is a condition of taking the field, not a goal for later." },
  { title: "Equipment and officiating standards", body: "Posts, padding, and field markings meet defined equipment standards on an inspection schedule, and every match is run by certified referees. Officiating quality is treated as a safety input, not an afterthought." },
];

function setText(sel, val) {
  const el = document.querySelector(sel);
  if (el && val) el.textContent = val;
}

function hydrateConfig(config) {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const val = getPath(config, el.dataset.config);
    if (val) el.textContent = val;
  });
}

function hydrateHeroHeadline(config) {
  const el = document.querySelector("[data-hero-headline]");
  const lines = config?.hero?.headline;
  if (!el || !Array.isArray(lines) || !lines.length) return;
  el.innerHTML = lines
    .map((line) => `<span class="line"><span>${esc(line)}</span></span>`)
    .join("");
}

function hydratePhases(phases) {
  setText("[data-summary]", phases?.summary);
  const track = document.querySelector("[data-phases]");
  if (!track) return;
  track.innerHTML = (phases?.phases || [])
    .map((p) => {
      const term = p.term || p.termPlaceholder || "";
      return `<div class="phase">
        <span class="phase__term">${esc(term)}</span>
        <h3 class="phase__title">${esc(p.title)}</h3>
      </div>`;
    })
    .join("");
}

function hydrateWhy(why) {
  if (!why) return;
  setText("[data-why-eyebrow]", why.eyebrow);
  setText("[data-why-title]", why.title);
  const grid = document.querySelector("[data-why-grid]");
  if (!grid) return;
  grid.innerHTML = (why.pillars || [])
    .map(
      (p) => `<div class="pillar">
        <span class="icon-badge">${iconSvg(p.icon)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
      </div>`
    )
    .join("");
}

function hydrateMomentum(momentum) {
  if (!momentum) return;
  setText("[data-momentum-eyebrow]", momentum.eyebrow);
  setText("[data-momentum-title]", momentum.title);
  const grid = document.querySelector("[data-momentum-grid]");
  if (!grid) return;
  grid.innerHTML = (momentum.subjects || [])
    .map((s) => {
      const wide = s.wide ? " subject__logo--wide" : "";
      const img = s.logo
        ? `<img src="${esc(s.logo)}" alt="${esc(s.alt)}" class="subject__logo${wide}" loading="lazy">`
        : "";
      const link =
        s.link && s.link.href
          ? `<a class="subject__link" href="${esc(s.link.href)}" target="_blank" rel="noopener">${esc(s.link.label || "Learn more")} <span aria-hidden="true">&rarr;</span></a>`
          : "";
      return `<div class="subject">${img}<p>${esc(s.body)}</p>${link}</div>`;
    })
    .join("");
}

function hydrateSafety() {
  const wrap = document.querySelector("[data-safety]");
  if (!wrap) return;
  wrap.innerHTML = SAFETY.map(
    (c) => `<div class="card"><h3 class="card__title">${esc(c.title)}</h3><p class="card__body">${esc(c.body)}</p></div>`
  ).join("");
}

function contactBlock(config) {
  if (!config.contactEmail) return "";
  return `<p class="form-contact">Prefer to talk first? <a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></p>`;
}

function hydrateForm(config) {
  const wrap = document.querySelector("[data-form-wrap]");
  if (!wrap) return;
  if (config.formEmbedUrl) {
    const fallback = config.formDirectUrl
      ? `<p class="form-fallback">Trouble seeing the form? <a href="${esc(config.formDirectUrl)}" target="_blank" rel="noopener">Open the form in a new tab</a>.</p>`
      : "";
    wrap.innerHTML = `<iframe class="form-embed" src="${esc(config.formEmbedUrl)}" title="Add your program form" loading="lazy">Loading…</iframe>${fallback}${contactBlock(config)}`;
  } else {
    const fallback = config.formDirectUrl
      ? `<p class="form-fallback"><a class="btn btn--outline btn--sm" href="${esc(config.formDirectUrl)}" target="_blank" rel="noopener">Open the form in a new tab</a></p>`
      : `<div class="form-missing">The sign-up form will appear here once it's connected.</div>`;
    wrap.innerHTML = fallback + contactBlock(config);
  }
}

function hydrateFaq(faq) {
  const wrap = document.querySelector("[data-faq]");
  if (!wrap) return;
  wrap.innerHTML = (faq?.faq || [])
    .map(
      (f) => `<details>
        <summary>${esc(f.q)}</summary>
        <div class="faq__body">${esc(f.a)}</div>
      </details>`
    )
    .join("");
}

function hydrateFooter(config) {
  const meta = document.querySelector("[data-footer-meta]");
  if (meta) {
    const parts = [];
    if (config.contactEmail)
      parts.push(`<a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`);
    if (config.proposalPdfUrl)
      parts.push(`<a href="${esc(config.proposalPdfUrl)}" target="_blank" rel="noopener">Read the full proposal</a>`);
    meta.innerHTML = parts.join("");
  }
  const org = document.querySelector("[data-footer-org]");
  if (org && config.parentOrg) org.textContent = config.parentOrg;
}

loadData().then((data) => {
  const config = data.config || {};
  hydrateConfig(config);
  hydrateHeroHeadline(config);
  hydratePhases(data.phases);
  hydrateWhy(data.why);
  hydrateMomentum(data.momentum);
  hydrateSafety();
  hydrateForm(config);
  hydrateFaq(data.faq);
  hydrateFooter(config);
});

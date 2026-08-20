/* budget-table.js — renders an example first-year budget (from a real
   proposal, generalized) plus a few financial highlights. No tiers, no
   dropdowns: a simple line-item table with a total, framed as an example
   any college can adapt.

   A real $0 (e.g. facilities) renders as "$0" because it's a true figure;
   a null amount renders as a muted dash. */

import { loadData, fmtMoney } from "./data.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const DASH = "—";

function renderExample(ex) {
  const table = document.querySelector("[data-budget-example]");
  if (!table || !ex) return;
  const rows = (ex.lineItems || [])
    .map((it) => {
      const money = fmtMoney(it.amount);
      return `<tr>
        <th scope="row">${esc(it.label)}</th>
        <td class="${money === null ? "is-null" : ""}">${money ?? DASH}</td>
      </tr>`;
    })
    .join("");
  const total = fmtMoney(ex.total);
  const totalNote = ex.totalNote
    ? `<tr class="ex-budget__note-row"><td colspan="2">${esc(ex.totalNote)}</td></tr>`
    : "";
  table.innerHTML = `
    <caption>${esc(ex.label || "Example budget")}</caption>
    <tbody>
      ${rows}
      <tr class="is-total">
        <th scope="row">Year 1 total</th>
        <td>${total ?? DASH}</td>
      </tr>
      ${totalNote}
    </tbody>`;
}

function renderHighlights(highlights) {
  const wrap = document.querySelector("[data-budget-highlights]");
  if (!wrap) return;
  wrap.innerHTML = (highlights || [])
    .map(
      (h) => `<div class="fin">
        <h3 class="fin__title">${esc(h.label)}</h3>
        <p class="fin__body">${esc(h.body)}</p>
      </div>`
    )
    .join("");
}

function renderIntro(intro) {
  const el = document.querySelector("[data-budget-intro]");
  if (el && intro) el.textContent = intro;
}

loadData().then((data) => {
  const b = data.budget || {};
  renderIntro(b.intro);
  renderExample(b.example);
  renderHighlights(b.highlights);
});

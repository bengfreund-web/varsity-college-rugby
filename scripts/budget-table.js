/* budget-table.js — the financial model.
   Executive-level first, detail on demand: a top-line Year-One figure, then an
   expandable breakdown into categories, each of which opens to line items. */

import { loadData, fmtMoney } from "./data.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const DASH = "—";
const money = (v) => fmtMoney(v) ?? DASH;

function setText(sel, val) {
  const el = document.querySelector(sel);
  if (el && val != null) el.textContent = val;
}

function render(budget) {
  if (!budget) return;
  setText("[data-budget-eyebrow]", budget.eyebrow);
  setText("[data-budget-title]", budget.title);
  setText("[data-budget-total-label]", budget.totalLabel);
  setText("[data-budget-total]", money(budget.total));
  setText("[data-budget-note]", budget.note);

  const wrap = document.querySelector("[data-budget-breakdown]");
  if (!wrap) return;
  wrap.innerHTML = (budget.categories || [])
    .map((c) => {
      const items = (c.items || [])
        .map(
          (it) =>
            `<div class="road__task-row"><span>${esc(it.label)}</span><span class="road__amt">${money(it.amount)}</span></div>`
        )
        .join("");
      return `<details class="road road--budget">
        <summary>
          <span class="road__stage">${esc(c.label)}</span>
          <span class="road__amt road__amt--cat">${money(c.amount)}</span>
        </summary>
        <div class="road__tasks road__tasks--budget">${items}</div>
      </details>`;
    })
    .join("");
}

loadData().then((data) => render(data.budget));

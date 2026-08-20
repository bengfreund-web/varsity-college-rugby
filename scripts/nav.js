/* nav.js — sticky nav scrollspy + mobile overlay menu. */

const toggle = document.querySelector(".nav__toggle");
const overlay = document.getElementById("nav-overlay");

if (toggle && overlay) {
  const setOpen = (open) => {
    overlay.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => {
    setOpen(!overlay.classList.contains("is-open"));
  });
  overlay.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* Scrollspy — underline the active section link in gold. */
const links = Array.from(document.querySelectorAll(".nav__link"));
const byId = new Map(
  links.map((l) => [l.getAttribute("href").slice(1), l])
);
const sections = links
  .map((l) => document.getElementById(l.getAttribute("href").slice(1)))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const link = byId.get(entry.target.id);
          if (link) link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}

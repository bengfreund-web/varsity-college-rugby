/* reveal.js — scroll reveal on entry. Respects prefers-reduced-motion:
   under reduced motion everything renders in final state immediately. */

const RM = window.matchMedia("(prefers-reduced-motion: reduce)");
const els = document.querySelectorAll(".reveal");

if (RM.matches || !("IntersectionObserver" in window)) {
  els.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
}

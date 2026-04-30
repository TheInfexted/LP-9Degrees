/**
 * Reveal-on-scroll. Adds .is-visible to .reveal / .reveal-stagger nodes
 * once they enter the viewport, then unobserves so the effect plays once.
 *
 * Respects prefers-reduced-motion: in that case the CSS already shows
 * everything in its final state, so we don't need to flip any classes.
 */

const PREFERS_REDUCED_MOTION =
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function init() {
  const targets = document.querySelectorAll<HTMLElement>(
    ".reveal, .reveal-stagger"
  );

  if (!targets.length) return;

  if (PREFERS_REDUCED_MOTION || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Pre-index stagger children so CSS transition-delay can read --reveal-i
  document
    .querySelectorAll<HTMLElement>(".reveal-stagger")
    .forEach((parent) => {
      Array.from(parent.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--reveal-i", String(i));
      });
    });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  targets.forEach((el) => io.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export {};

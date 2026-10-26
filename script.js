/* =========================================================
   Anushiya V | Portfolio script
   1. Settings  2. Mobile menu  3. Header shadow
   4. Active nav link  5. Resume download check  6. Footer year
   7. Scroll reveal
   ========================================================= */

/* 1. SETTINGS: change the resume path here if you rename the file */
const RESUME_PATH = "assets/Anushiya_V_Resume.pdf";

// Point every "Download Resume" button to the path above
document.querySelectorAll("[data-resume]").forEach((link) => {
  link.setAttribute("href", RESUME_PATH);
});

/* 2. MOBILE MENU */
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");

function setMenu(open) {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* 3. HEADER SHADOW once the page is scrolled */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* 4. HIGHLIGHT the nav link of the section currently on screen */
const links = document.querySelectorAll('.nav-menu a[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));

/* 5. RESUME: if the PDF is missing, show a message instead of a broken download */
const toast = document.getElementById("toast");
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}
document.querySelectorAll("[data-resume]").forEach((link) => {
  link.addEventListener("click", async (e) => {
    try {
      const res = await fetch(RESUME_PATH, { method: "HEAD" });
      if (!res.ok) {
        e.preventDefault();
        showToast("Resume file not found. Add it to the assets folder as " + RESUME_PATH.split("/").pop());
      }
    } catch (err) {
      // Opened without a server (file://): let the browser handle the download normally
    }
  });
});

/* 6. FOOTER YEAR */
document.getElementById("year").textContent = new Date().getFullYear();

/* 7. SCROLL REVEAL: sections fade in as you scroll down */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(
    ".section h2, .section-sub, .prose, .skill-card, .project, .timeline li, .cert-grid li, .edu-card, .contact > *"
  );

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      obs.unobserve(el);
      // After the animation, remove the classes so card hover effects work normally
      setTimeout(() => el.classList.remove("reveal", "visible"), 1200);
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => {
    // Small delay per item so cards appear one after another
    const index = Array.from(el.parentElement.children).indexOf(el);
    el.style.setProperty("--d", Math.min(index, 4) * 0.08 + "s");
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

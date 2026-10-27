// Mark that JS is running so reveal animations only hide content when they can show it again
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal");

// Stagger items that share a parent
revealEls.forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.setProperty("--d", `${siblings.indexOf(el) * 0.08}s`);
});

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        const bars = entry.target.querySelector(".bars");
        if (bars) bars.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
  document.querySelectorAll(".bars").forEach((b) => b.classList.add("in"));
}

/* ---------- Nav: shadow, progress bar, active link ---------- */
const nav = document.querySelector(".nav");
const progress = document.querySelector(".progress-bar");
const links = [...document.querySelectorAll(".nav-links a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle("scrolled", y > 10);
  progress.style.setProperty("--p", max > 0 ? y / max : 0);

  let current = -1;
  sections.forEach((s, i) => {
    if (s && s.getBoundingClientRect().top <= 120) current = i;
  });
  links.forEach((a, i) => a.classList.toggle("active", i === current));
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* ---------- Theme toggle ---------- */
const root = document.documentElement;

document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark =
    root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const next = isDark ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

/* ---------- Typing effect for the title ---------- */
const typed = document.getElementById("typed");
const roles = [
  "UI/UX – Front End Specialist",
  "Information Technology Student",
  "Aspiring Web Developer",
  "Future IT Professional",
];

if (typed && !reduceMotion) {
  let r = 0;
  let c = roles[0].length;
  let deleting = true;

  function tick() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);

    let wait = deleting ? 35 : 70;
    if (!deleting && c === word.length) {
      deleting = true;
      wait = 2200;
    } else if (deleting && c === 0) {
      deleting = false;
      r = (r + 1) % roles.length;
      wait = 400;
    }
    setTimeout(tick, wait);
  }
  setTimeout(tick, 2600);
}

/* ---------- Live GitHub stats (falls back to the numbers in the HTML) ---------- */
fetch("https://api.github.com/users/Meowjaaaa")
  .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
  .then((u) => {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== null && val !== undefined && val !== "") el.textContent = val;
    };
    set("gh-name", u.name);
    set("gh-bio", u.bio);
    set("gh-repos", u.public_repos);
    set("gh-followers", u.followers);
    set("gh-following", u.following);
    if (u.created_at) set("gh-since", new Date(u.created_at).getFullYear());
  })
  .catch(() => {});

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById("copy-email");
const toast = document.getElementById("toast");
const email = "Remonde.kervin@dnsc.edu.ph";

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = "Email copied!";
  } catch (e) {
    toast.textContent = email;
  }
  toast.classList.add("show");
  clearTimeout(copyBtn._t);
  copyBtn._t = setTimeout(() => toast.classList.remove("show"), 2200);
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

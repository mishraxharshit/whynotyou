/* js/main.js – FINAL DARK MODE + EVERYTHING FIXED */
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    console.error(err);
    alert("Failed to load content. Check connection.");
    return null;
  }
}

/* === ARTICLES & COURSES (only on homepage) === */
async function renderArticles() { /* ... your existing code ... */ }
async function renderCourses() { /* ... your existing code ... */ }

document.addEventListener("DOMContentLoaded", () => {
  renderArticles();
  renderCourses();
});

/* DARK MODE – WORKS ON EVERY PAGE */
const toggleBtn = document.getElementById("theme-toggle");

function applyTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved === "dark" || (!saved && prefersDark)) {
    document.body.classList.add("dark");
    if (toggleBtn) toggleBtn.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    if (toggleBtn) toggleBtn.textContent = "Dark Mode";
  }
}

// Run on every page load
applyTheme();

// Toggle when clicked
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Close menu when link clicked
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

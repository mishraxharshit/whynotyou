/* js/main.js – FINAL DARK MODE + EVERYTHING FIXED */

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

// ============================================
// DARK/LIGHT MODE TOGGLE - WORKING VERSION
// ============================================

console.log("main.js loaded");

// Dark/Light Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Get saved theme or system preference
const savedTheme = localStorage.getItem("whynotyou-theme") || 
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

// Apply theme
function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("whynotyou-theme", theme);
}

// Initialize
applyTheme(savedTheme);

// Toggle on click
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});

// Load courses
async function loadCourses() {
  const list = document.getElementById("courses-list");
  if (!list) return;

  try {
    const res = await fetch("api/courses.json");
    const data = await res.json();
    
    list.innerHTML = "";
    data.forEach(course => {
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <a href="lesson.html?course=${course.id}&chapter=1&topic=1" class="read-more">Start Learning →</a>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadCourses);

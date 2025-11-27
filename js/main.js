/* FINAL main.js - site loader + theme system */

/* SAFE JSON FETCH */
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

/* RENDER ARTICLES */
async function renderArticles() {
  const container = document.getElementById("blog-container");
  if (!container) return;

  const data = await fetchJSON("/api/articles.json");
  if (!data || !data.articles) {
    container.innerHTML = "<p>Unable to load articles.</p>";
    return;
  }

  container.innerHTML = "";

  for (const a of data.articles) {
    const excerpt =
      a.excerpt ||
      (a.content ? a.content.split("\n")[0] : "No preview available");

    const el = document.createElement("article");
    el.className = "article-card";

    el.innerHTML = `
      <h3>${a.title}</h3>
      <p>${excerpt}</p>
      <a class="read-more" href="/article.html?id=${encodeURIComponent(a.id)}">Read More</a>
    `;

    container.appendChild(el);
  }
}

/* RENDER COURSES */
async function renderCourses() {
  const container = document.getElementById("courses-list");
  if (!container) return;

  const courses = await fetchJSON("/api/courses.json");
  if (!courses) {
    container.innerHTML = "<p>Unable to load courses.</p>";
    return;
  }

  container.innerHTML = "";

  for (const c of courses) {
    const el = document.createElement("div");
    el.className = "course-card";

    el.innerHTML = `
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <a class="read-more" href="/course.html?id=${encodeURIComponent(c.id)}">Open Course</a>
    `;

    container.appendChild(el);
  }
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  renderArticles();
  renderCourses();
});

/* THEME SYSTEM */
const toggleBtn = document.getElementById("theme-toggle");

/* Auto-detect on first visit */
if (!localStorage.getItem("theme")) {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

/* Apply saved theme */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggleBtn) toggleBtn.textContent = "☀️";
} else {
  document.body.classList.remove("dark");
  if (toggleBtn) toggleBtn.textContent = "🌙";
}

/* Toggle handler */
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    if (isDark) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "🌙";
    }
  });
}


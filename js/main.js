// main.js - fetch data from backend API or local files
async function fetchJSON(url){
  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (e) {
    console.error('Fetch error', e);
    return null;
  }
}

async function renderArticles(){
  const articles = await fetchJSON('/api/articles.json');
  const container = document.getElementById('blog-container');
  if(!articles || !container) return;
  container.innerHTML = '';
  for(const a of articles.articles){
    const el = document.createElement('article');
    el.className = 'blog-card';
    el.innerHTML = `<h3>${a.title}</h3><p>${a.excerpt || a.content.split('\n')[0]}</p><a class="read-more" href="/article.html?id=${encodeURIComponent(a.id)}">Read More</a>`;
    container.appendChild(el);
  }
}

async function renderCourses(){
  const courses = await fetchJSON('/api/courses.json');
  const container = document.getElementById('courses-list');
  if(!courses || !container) return;
  container.innerHTML = '';
  for(const c of courses){
    const el = document.createElement('div');
    el.className = 'course-card';
    el.innerHTML = `<h3>${c.title}</h3><p>${c.description}</p><a class="read-more" href="/course.html?id=${encodeURIComponent(c.id)}">Open Course</a>`;
    container.appendChild(el);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ renderArticles(); renderCourses(); });
// -------------------------------
// THEME TOGGLE
// -------------------------------
const themeBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (themeBtn) themeBtn.textContent = "☀️";
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            themeBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeBtn.textContent = "🌙";
        }
    });
}

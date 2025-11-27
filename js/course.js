/* ------------------------------------------------------------
   course.js — Lesson Loader + Progress System
------------------------------------------------------------- */

async function fetchJSON(url) {
  return fetch(url).then(r => r.json());
}

let currentLessonIndex = 0;
let lessons = [];
let courseId = null;

document.addEventListener("DOMContentLoaded", initCourse);

async function initCourse() {
  const params = new URLSearchParams(location.search);
  courseId = params.get("id");

  if (!courseId) return;

  const courses = await fetchJSON("/api/courses.json");
  const course = courses.find(c => c.id == courseId);

  if (!course) return;

  document.getElementById("course-title").textContent = course.title;
  lessons = course.lessons;

  renderLessonList();
  loadLesson(0);
}

/* --------------------------
   Render Sidebar Lesson List
---------------------------*/
function renderLessonList() {
  const list = document.getElementById("lesson-list");
  list.innerHTML = "";

  lessons.forEach((lesson, index) => {
    const a = document.createElement("a");
    a.textContent = lesson.title;
    a.href = "javascript:void(0)";
    a.onclick = () => loadLesson(index);
    a.id = "lesson-" + index;

    list.appendChild(a);
  });
}

/* --------------------------
   Load Lesson Content
---------------------------*/
function loadLesson(i) {
  currentLessonIndex = i;

  const lesson = lessons[i];

  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-body").innerHTML =
    lesson.content.replace(/\n/g, "<br><br>");

  updateActiveLesson();
  updateProgress();
}

/* --------------------------
   Highlight Active Lesson
---------------------------*/
function updateActiveLesson() {
  document.querySelectorAll(".lesson-list a").forEach(el => {
    el.classList.remove("active");
  });
  document.getElementById("lesson-" + currentLessonIndex).classList.add("active");
}

/* --------------------------
   Update Progress Bar
---------------------------*/
function updateProgress() {
  const bar = document.getElementById("progress-bar");
  const percent = ((currentLessonIndex + 1) / lessons.length) * 100;
  bar.style.width = percent + "%";
}

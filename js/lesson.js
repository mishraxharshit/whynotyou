function getQuery(param) {
  return new URLSearchParams(window.location.search).get(param);
}

async function fetchJSON(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.error("JSON load error:", e);
    alert("Failed to load lesson. Please try again.");
    return null;
  }
}

let courseId, lessonId, courseData;

async function loadLesson() {
  courseId = getQuery("course");
  lessonId = parseInt(getQuery("lesson")) || 1;

  if (!courseId) {
    document.getElementById("lesson-body").innerHTML = "<p>Invalid course link.</p>";
    return;
  }

  const courses = await fetchJSON("/api/courses.json");
  if (!courses) return;

  courseData = courses.find(c => c.id === courseId);
  if (!courseData) {
    document.getElementById("lesson-body").innerHTML = "<p>Course not found.</p>";
    return;
  }

  const lesson = courseData.lessons.find(l => l.id === lessonId);
  if (!lesson) {
    document.getElementById("lesson-body").innerHTML = "<p>Lesson not found.</p>";
    return;
  }

  document.getElementById("course-title").textContent = courseData.title;
  document.getElementById("lesson-title").textContent = `${lessonId}. ${lesson.title}`;
  document.getElementById("lesson-body").innerHTML = lesson.content;

  createSidebar();
  updateButtons();
}

function createSidebar() {
  const list = document.getElementById("lesson-list");
  list.innerHTML = "";

  courseData.lessons.forEach(l => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `lesson.html?course=${courseId}&lesson=${l.id}`;
    a.textContent = `${l.id}. ${l.title}`;
    if (l.id === lessonId) a.className = "active";
    li.appendChild(a);
    list.appendChild(li);
  });
}

function updateButtons() {
  const prev = document.getElementById("prev-lesson");
  const next = document.getElementById("next-lesson");

  prev.onclick = () => lessonId > 1 && (location.href = `lesson.html?course=${courseId}&lesson=${lessonId - 1}`);
  next.onclick = () => lessonId < courseData.lessons.length && (location.href = `lesson.html?course=${courseId}&lesson=${lessonId + 1}`);

  prev.style.opacity = lessonId <= 1 ? "0.4" : "1";
  next.style.opacity = lessonId >= courseData.lessons.length ? "0.4" : "1";
}

document.addEventListener("DOMContentLoaded", loadLesson);
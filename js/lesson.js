// lesson.js — single lesson loader + next/prev + progress persistence

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

function getProgressObj(courseId) {
  const raw = localStorage.getItem("course_progress_" + courseId);
  return raw ? JSON.parse(raw) : { completed: [], total: 0 };
}

function setProgressObj(courseId, obj) {
  localStorage.setItem("course_progress_" + courseId, JSON.stringify(obj));
}

async function loadLessonPage() {
  const params = new URLSearchParams(location.search);
  const courseId = params.get("course");
  const lessonId = params.get("lesson");

  if (!courseId || !lessonId) {
    document.getElementById("lesson-title").textContent = "Invalid lesson";
    return;
  }

  const data = await fetchJSON("/api/courses.json");
  const course = data.courses.find(c => c.id === courseId);
  if (!course) {
    document.getElementById("lesson-title").textContent = "Course not found";
    return;
  }

  const lessons = course.lessons;
  const index = lessons.findIndex(l => String(l.id) === String(lessonId));
  if (index === -1) {
    document.getElementById("lesson-title").textContent = "Lesson not found";
    return;
  }

  // Populate UI
  const lesson = lessons[index];
  document.title = lesson.title + " — " + course.title;
  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-meta").textContent = course.title;

  // Render content (supports array or string)
  let html = "";
  if (Array.isArray(lesson.content)) {
    html = lesson.content.map(p => `<p>${p}</p>`).join("");
  } else {
    html = lesson.content;
  }
  document.getElementById("lesson-content").innerHTML = html;

  // Prev / Next link
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (index > 0) {
    prevBtn.style.visibility = "visible";
    prevBtn.href = `lesson.html?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lessons[index-1].id)}`;
  } else {
    prevBtn.style.visibility = "hidden";
  }

  if (index < lessons.length - 1) {
    nextBtn.style.visibility = "visible";
    nextBtn.href = `lesson.html?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lessons[index+1].id)}`;
  } else {
    nextBtn.style.visibility = "hidden";
  }

  // Save progress
  let prog = getProgressObj(courseId);
  prog.total = lessons.length;
  if (!prog.completed.includes(lesson.id)) {
    prog.completed.push(lesson.id);
    setProgressObj(courseId, prog);
  }

  // Update progress UI
  const percent = Math.round((prog.completed.length / prog.total) * 100);
  document.getElementById("lesson-progress").style.width = percent + "%";
}

document.addEventListener("DOMContentLoaded", loadLessonPage);

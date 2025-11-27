// course.js — Course listing + progress summary

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function getProgressForCourse(id) {
  const raw = localStorage.getItem("course_progress_" + id);
  if (!raw) return 0;
  const obj = JSON.parse(raw);
  return obj.completed ? (obj.completed.length / (obj.total || 1)) * 100 : 0;
}

function saveProgressForCourse(id, completedList, total) {
  const obj = { completed: completedList, total };
  localStorage.setItem("course_progress_" + id, JSON.stringify(obj));
}

async function renderCourseList() {
  const wrapper = document.getElementById("course-list");
  const data = await fetchJSON("/api/courses.json");
  if (!data || !data.courses) {
    wrapper.innerHTML = "<p class='muted'>No courses available.</p>";
    return;
  }

  wrapper.innerHTML = "";

  for (const course of data.courses) {
    const percent = Math.round(getProgressForCourse(course.id) || 0);

    const card = document.createElement("div");
    card.className = "course-card hover-float";
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p class="muted">${course.description || ""}</p>

      <div style="margin-top:14px;display:flex;align-items:center;gap:12px;">
        <div style="flex:1">
          <div style="height:8px;background:var(--bg-alt);border-radius:999px;overflow:hidden">
            <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width:.4s"></div>
          </div>
        </div>

        <a class="btn ghost" href="course.html?id=${encodeURIComponent(course.id)}">Open</a>
        <a class="btn primary" href="lesson.html?course=${encodeURIComponent(course.id)}&lesson=${encodeURIComponent(course.lessons[0].id)}">Start →</a>
      </div>
    `;

    wrapper.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", renderCourseList);

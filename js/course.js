async function fetchJSON(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Network error");
    return await r.json();
  } catch (e) {
    console.error("JSON Fetch Error:", e);
    alert("Failed to load courses. Please refresh.");
    return null;
  }
}

async function loadCourses() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  const list = document.getElementById("courses-list");
  const data = await fetchJSON("/api/courses.json");
  if (!data) {
    list.innerHTML = "<p>Failed to load courses.</p>";
    return;
  }

  let coursesToShow = data;
  if (courseId) {
    coursesToShow = data.filter(c => c.id === courseId);
    if (coursesToShow.length === 0) {
      list.innerHTML = "<p>Course not found.</p>";
      return;
    }
  }

  list.innerHTML = "";

  coursesToShow.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-card glass fade-in hover-glow";

    div.innerHTML = `
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <a class="read-more" href="/lesson.html?course=${encodeURIComponent(course.id)}&lesson=1">
        Start Learning →
      </a>
    `;
    list.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadCourses);
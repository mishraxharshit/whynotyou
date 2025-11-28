// ...existing code...
async function fetchJSON(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Network error: " + r.status);
    return await r.json();
  } catch (e) {
    console.error("JSON Fetch Error:", e);
    alert("Failed to load courses. Please refresh.");
    return null;
  }
}

async function loadCourses() {
  try {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id") || params.get("course"); // support both query names

    const list = document.getElementById("courses-list");
    if (!list) {
      // nothing to do on pages without a courses list
      return;
    }

    // Use relative path so it works with Live Server or file:// when files are in the same project
    const data = await fetchJSON("api/courses.json");
    if (!data) {
      list.innerHTML = "<p>Failed to load courses.</p>";
      return;
    }

    let coursesToShow = data;
    if (courseId) {
      coursesToShow = data.filter(c => String(c.id) === String(courseId));
      if (coursesToShow.length === 0) {
        list.innerHTML = "<p>Course not found.</p>";
        return;
      }
    }

    list.innerHTML = "";

    coursesToShow.forEach(course => {
      const card = document.createElement("div");
      card.className = "course-card glass fade-in hover-glow";

      const h2 = document.createElement("h2");
      h2.textContent = course.title || "Untitled course";

      const p = document.createElement("p");
      p.textContent = course.description || "";

      const a = document.createElement("a");
      a.className = "read-more";
      a.href = `lesson.html?course=${encodeURIComponent(course.id)}&lesson=1`;
      a.textContent = "Start Learning →";

      card.appendChild(h2);
      card.appendChild(p);
      card.appendChild(a);

      list.appendChild(card);
    });
  } catch (err) {
    console.error("loadCourses error:", err);
    const list = document.getElementById("courses-list");
    if (list) list.innerHTML = "<p>Failed to load courses.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadCourses);
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

let coursesData = [];
let currentPath = { courseId: null, chapterId: null, topicId: null };
let allLessons = [];

// Fetch data and initialize
async function initLesson() {
  try {
    const params = new URLSearchParams(window.location.search);
    currentPath.courseId = params.get("course");
    currentPath.chapterId = params.get("chapter");
    currentPath.topicId = params.get("topic");

    const response = await fetch("api/courses.json");
    if (!response.ok) throw new Error("Failed to load courses");
    coursesData = await response.json();

    buildFlatLessonList();
    renderSidebar();
    loadLesson();
    setupMobileMenu();
  } catch (err) {
    console.error("Init error:", err);
    document.getElementById("lesson-title").textContent = "Error loading course";
  }
}

// Build flat list of all lessons for navigation
function buildFlatLessonList() {
  allLessons = [];
  
  coursesData.forEach(course => {
    if (String(course.id) === String(currentPath.courseId)) {
      (course.chapters || []).forEach(chapter => {
        (chapter.topics || []).forEach(topic => {
          allLessons.push({
            courseId: course.id,
            courseName: course.title,
            chapterId: chapter.id,
            chapterName: chapter.title,
            topicId: topic.id,
            topicName: topic.title,
            content: topic.content,
            duration: topic.duration,
            difficulty: topic.difficulty
          });
        });
      });
    }
  });
}

// Render sidebar with chapters and topics
function renderSidebar() {
  const course = coursesData.find(c => String(c.id) === String(currentPath.courseId));
  if (!course) return;

  document.getElementById("course-title").textContent = course.title;

  const chaptersList = document.getElementById("chapters-list");
  chaptersList.innerHTML = "";

  (course.chapters || []).forEach(chapter => {
    const chapterItem = document.createElement("div");
    chapterItem.className = "chapter-item";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "chapter-toggle";
    if (String(chapter.id) === String(currentPath.chapterId)) {
      toggleBtn.classList.add("active", "expanded");
    }
    toggleBtn.textContent = `${chapter.title}`;

    const topicsDiv = document.createElement("div");
    topicsDiv.className = "subsections";
    if (String(chapter.id) === String(currentPath.chapterId)) {
      topicsDiv.classList.add("show");
    }

    (chapter.topics || []).forEach(topic => {
      const topicItem = document.createElement("div");
      topicItem.className = "subsection-item";

      const topicLink = document.createElement("a");
      topicLink.className = "subsection-link";
      if (String(topic.id) === String(currentPath.topicId)) {
        topicLink.classList.add("active");
      }
      topicLink.href = `lesson.html?course=${currentPath.courseId}&chapter=${chapter.id}&topic=${topic.id}`;
      topicLink.textContent = `${topic.title}`;

      topicItem.appendChild(topicLink);
      topicsDiv.appendChild(topicItem);
    });

    toggleBtn.addEventListener("click", () => {
      toggleBtn.classList.toggle("expanded");
      topicsDiv.classList.toggle("show");
    });

    chapterItem.appendChild(toggleBtn);
    chapterItem.appendChild(topicsDiv);
    chaptersList.appendChild(chapterItem);
  });
}

// Load and display current lesson
function loadLesson() {
  const currentLesson = allLessons.find(l =>
    String(l.topicId) === String(currentPath.topicId) &&
    String(l.chapterId) === String(currentPath.chapterId)
  );

  if (!currentLesson) {
    document.getElementById("lesson-title").textContent = "Lesson not found";
    return;
  }

  // Update breadcrumb
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.innerHTML = `
    <a href="course.html">Courses</a> /
    <span>${currentLesson.courseName}</span> /
    <span>${currentLesson.chapterName}</span> /
    <strong>${currentLesson.topicName}</strong>
  `;

  // Update lesson info
  document.getElementById("lesson-title").textContent = currentLesson.topicName;
  document.getElementById("lesson-duration").textContent = `⏱️ ${currentLesson.duration || "30 min"}`;
  document.getElementById("lesson-difficulty").textContent = `📊 ${currentLesson.difficulty || "Beginner"}`;

  // Load content
  document.getElementById("lesson-content").innerHTML = currentLesson.content;

  // Generate table of contents
  generateTableOfContents();

  // Update navigation buttons
  const currentIndex = allLessons.findIndex(l =>
    String(l.topicId) === String(currentPath.topicId)
  );

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (currentIndex > 0) {
    const prevLesson = allLessons[currentIndex - 1];
    prevBtn.disabled = false;
    prevBtn.onclick = () => {
      window.location.href = `lesson.html?course=${prevLesson.courseId}&chapter=${prevLesson.chapterId}&topic=${prevLesson.topicId}`;
    };
  } else {
    prevBtn.disabled = true;
  }

  if (currentIndex < allLessons.length - 1) {
    const nextLesson = allLessons[currentIndex + 1];
    nextBtn.disabled = false;
    nextBtn.onclick = () => {
      window.location.href = `lesson.html?course=${nextLesson.courseId}&chapter=${nextLesson.chapterId}&topic=${nextLesson.topicId}`;
    };
  } else {
    nextBtn.disabled = true;
  }

  // Update progress
  document.getElementById("progress-text").textContent = `${currentIndex + 1} of ${allLessons.length}`;

  // Scroll to top
  window.scrollTo(0, 0);
}

// Generate table of contents from headings
function generateTableOfContents() {
  const content = document.getElementById("lesson-content");
  const headings = content.querySelectorAll("h2, h3");
  const toc = document.getElementById("page-toc");

  toc.innerHTML = "";

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;

    const level = heading.tagName === "H2" ? "l1" : "l2";
    link.style.paddingLeft = level === "l1" ? "1rem" : "2rem";

    toc.appendChild(link);
  });
}

// Mobile sidebar toggle
function setupMobileMenu() {
  const toggle = document.getElementById("sidebar-toggle");
  const close = document.getElementById("sidebar-close");
  const sidebar = document.querySelector(".lesson-sidebar");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });

  close.addEventListener("click", () => {
    sidebar.classList.remove("show");
  });

  // Close sidebar when link clicked
  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("show");
    });
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initLesson);
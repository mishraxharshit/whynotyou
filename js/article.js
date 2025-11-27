async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("bad");
    return res.json();
  } catch (e) {
    console.error(e);
    alert("Failed to load article.");
    return { articles: [] };
  }
}

const params = new URLSearchParams(location.search);
const id = params.get("id");

async function renderArticle() {
  const data = await fetchJSON("/api/articles.json");
  const article = data.articles.find(a => a.id === id);

  if (!article) {
    document.getElementById("article-content").innerHTML = "<h1>Article not found</h1>";
    return;
  }

  document.getElementById("article-title").textContent = article.title;
  document.getElementById("article-content").innerHTML = article.content.map(p => `<p>${p}</p>`).join("");
}

document.addEventListener("DOMContentLoaded", renderArticle);
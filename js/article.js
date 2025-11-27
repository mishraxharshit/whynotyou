// article.js - load article content into article.html
async function loadArticleContent() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    try {
        const response = await fetch("/api/articles.json");
        const data = await response.json();
        const article = data.articles.find(a => a.id === id);

        const titleEl = document.getElementById("article-title");
        const contentEl = document.getElementById("article-content");
        const metaEl = document.getElementById("article-meta");

        if (!article) {
            titleEl.innerText = "Article Not Found";
            contentEl.innerHTML = "<p>The article you are looking for does not exist.</p>";
            return;
        }

        titleEl.innerText = article.title;
        metaEl.innerText = `${article.read_time} · ${article.category}`;

        const formatted = article.content
            .split("\n\n")
            .map(p => `<p>${p}</p>`)
            .join("");

        contentEl.innerHTML = formatted;

    } catch (error) {
        console.error("Error loading article:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadArticleContent);

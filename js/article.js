async function fetchJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error("bad");
  return res.json();
}

const params = new URLSearchParams(location.search);
const id = params.get("id");

async function renderArticle(){
  const data = await fetchJSON("/api/articles.json");
  const article = data.articles.find(a => a.id === id);

  const box = document.getElementById("article-content");

  box.innerHTML = `
    <h1>${article.title}</h1>
    <p class="meta">${article.date} • ${article.author}</p>
    ${article.content}
  `;

  const aside = document.getElementById("latest-list");
  data.articles.slice(0,5).forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/article.html?id=${a.id}">${a.title}</a>`;
    aside.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", renderArticle);

// Version 1: the posts are hardcoded and only displayed.

const posts = [
  {
    id: 1,
    title: "Welcome to my blog",
    date: "2026-11-01",
    content: "This is the first post on my mini blog application."
  },
  {
    id: 2,
    title: "What is CI/CD?",
    date: "2026-11-05",
    content: "CI/CD automatically builds, tests and deploys code every time it is pushed."
  },
  {
    id: 3,
    title: "Why version control matters",
    date: "2026-11-09",
    content: "Git keeps the full history of a project, so every change can be tracked and undone."
  }
];

function showPosts() {
  const list = document.getElementById("post-list");
  list.innerHTML = "";

  for (const post of posts) {
    const card = document.createElement("article");
    card.className = "post";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const date = document.createElement("p");
    date.className = "date";
    date.textContent = post.date;

    const content = document.createElement("p");
    content.textContent = post.content;

    card.append(title, date, content);
    list.appendChild(card);
  }
}

showPosts();

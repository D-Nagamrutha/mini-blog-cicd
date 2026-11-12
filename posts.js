// Blog logic, kept separate from the page so it can be unit tested.
// Every function returns a NEW array instead of changing the old one.

function today() {
  return new Date().toISOString().slice(0, 10);
}

function checkPostInput(title, content) {
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("Title is required");
  }
  if (typeof content !== "string" || content.trim() === "") {
    throw new Error("Content is required");
  }
}

// Adds a post to the end of the array.
function createPost(posts, title, content) {
  checkPostInput(title, content);

  let highestId = 0;
  for (const post of posts) {
    if (post.id > highestId) highestId = post.id;
  }

  const newPost = {
    id: highestId + 1,
    title: title.trim(),
    content: content.trim(),
    date: today()
  };
  return [...posts, newPost];
}

// Removes the post with the given id.
function deletePost(posts, id) {
  return posts.filter((post) => post.id !== id);
}

// Changes the title and content of the post with the given id.
function updatePost(posts, id, title, content) {
  checkPostInput(title, content);
  return posts.map((post) =>
    post.id === id
      ? { ...post, title: title.trim(), content: content.trim() }
      : post
  );
}

// ---- Markdown ----

// Stops any HTML typed into a post from running in the page.
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// `code`, **bold**, *italic* and [text](link)
function renderInline(text) {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
}

// Converts a small subset of Markdown to HTML:
// #, ## and ### headings, "- " lists, paragraphs and the inline styles above.
function renderMarkdown(markdown) {
  const lines = escapeHtml(markdown).split("\n");
  const html = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const isListItem = line.startsWith("- ");

    if (inList && !isListItem) {
      html.push("</ul>");
      inList = false;
    }
    if (line === "") continue;

    if (isListItem) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push("<li>" + renderInline(line.slice(2)) + "</li>");
    } else if (line.startsWith("### ")) {
      html.push("<h5>" + renderInline(line.slice(4)) + "</h5>");
    } else if (line.startsWith("## ")) {
      html.push("<h4>" + renderInline(line.slice(3)) + "</h4>");
    } else if (line.startsWith("# ")) {
      html.push("<h3>" + renderInline(line.slice(2)) + "</h3>");
    } else {
      html.push("<p>" + renderInline(line) + "</p>");
    }
  }

  if (inList) html.push("</ul>");
  return html.join("\n");
}

const BlogPosts = { createPost, deletePost, updatePost, renderMarkdown };

// Lets Jest (Node.js) import the functions; the browser ignores this line.
if (typeof module !== "undefined" && module.exports) {
  module.exports = BlogPosts;
}

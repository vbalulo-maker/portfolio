document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('articleDetail');
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');

  if (!articleId) {
    container.innerHTML = '<p>❌ ID статьи не указан.</p>';
    return;
  }

  // Сначала загружаем метаданные статьи
  fetch('data/articles.json')
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить статьи');
      return res.json();
    })
    .then(articles => {
      const article = articles.find(a => a.id === articleId);
      if (!article) {
        container.innerHTML = `<p>❌ Статья "${articleId}" не найдена.</p>`;
        return;
      }

      // Отображаем заголовок и мета
      container.innerHTML = `
        <h1>${article.title}</h1>
        <p style="color:#555;">${article.description || ''} <br>
        <small>${article.date || ''} · ${article.author || ''}</small></p>
        <div class="article-body" id="markdownContent">⏳ Загрузка содержимого...</div>
        <a href="articles-list.html" style="display:inline-block; margin-top:20px; color:var(--accent);">← Назад к статьям</a>
      `;

      // Загружаем Markdown-файл
      const mdPath = `articles-content/${article.contentFile || `${articleId}.md`}`;
      return fetch(mdPath)
        .then(res => {
          if (!res.ok) throw new Error(`Не найден файл: ${mdPath}`);
          return res.text();
        })
        .then(markdown => {
          // Конвертируем через marked (глобальный объект)
          const html = marked.parse(markdown);
          document.getElementById('markdownContent').innerHTML = html;
        })
        .catch(err => {
          document.getElementById('markdownContent').innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
          console.error(err);
        });
    })
    .catch(err => {
      container.innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
      console.error(err);
    });
});
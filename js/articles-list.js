document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('articlesList');

  fetch('data/articles.json')
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить статьи');
      return res.json();
    })
    .then(data => {
      list.innerHTML = data.map(article => `
        <div class="article-item" data-id="${article.id}">
          <div class="article-info">
            <h3>${article.title}</h3>
            <p>${article.description || ''}</p>
            <small style="color:#777;">${article.date || ''} · ${article.author || ''}</small>
          </div>
          <div class="article-actions">
            <button class="share-btn telegram" data-share="telegram" data-title="${article.title}" data-id="${article.id}">📨 Telegram</button>
            <button class="share-btn linkedin" data-share="linkedin" data-title="${article.title}" data-id="${article.id}">🔗 LinkedIn</button>
            <a href="article-detail.html?id=${article.id}" class="share-btn" style="text-decoration:none; background:var(--accent); color:#fff; border-color:var(--accent);">Читать</a>
          </div>
        </div>
      `).join('');

      // Обработчики шаринга
      document.querySelectorAll('.share-btn[data-share]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = btn.dataset.share;
          const title = btn.dataset.title;
          const id = btn.dataset.id;
          const url = `${window.location.origin}/article-detail.html?id=${id}`;
          const text = `${title} — ${url}`;

          if (type === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
          } else if (type === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
          }
        });
      });
    })
    .catch(err => {
      list.innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
      console.error(err);
    });
});
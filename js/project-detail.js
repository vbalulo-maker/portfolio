document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('projectDetail');
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    container.innerHTML = '<p>❌ ID проекта не указан.</p>';
    return;
  }

  fetch('data/projects.json')
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить проекты');
      return res.json();
    })
    .then(data => {
      const project = data.find(p => p.id === projectId);
      if (!project) {
        container.innerHTML = `<p>❌ Проект "${projectId}" не найден.</p>`;
        return;
      }

      // Рендерим детали
      container.innerHTML = `
        <h1>${project.title}</h1>
        <p style="font-size:1.1rem; color:#444;">${project.description || ''}</p>
        <div class="project-metrics">
          ${project.metrics ? Object.entries(project.metrics).map(([key, val]) => `
            <div class="metric"><strong>${val}</strong> ${key}</div>
          `).join('') : ''}
        </div>
        <div class="screenshots">
          ${project.screenshots ? project.screenshots.map(src => `
            <img src="${src}" alt="screenshot" loading="lazy" />
          `).join('') : ''}
        </div>
        <div class="chart-placeholder">
          📊 График: ${project.chartLabel || 'данные не загружены'}
        </div>
        <p><strong>Компания:</strong> ${project.company || '—'}</p>
        <p><strong>Год:</strong> ${project.year || '—'}</p>
        <p><strong>Роль:</strong> ${project.role || '—'}</p>
        <a href="projects.html" style="display:inline-block; margin-top:20px; color:var(--accent);">← Назад к проектам</a>
      `;
    })
    .catch(err => {
      container.innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
      console.error(err);
    });
});
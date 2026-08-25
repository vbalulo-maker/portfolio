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

      // =============================================
      // 1. ТИП: PRESENTATION (загрузка внешнего HTML)
      // =============================================
      if (project.type === 'presentation') {
        const presentationPath = project.presentationFile || `cases/${project.id}.html`;
        fetch(presentationPath)
          .then(res => {
            if (!res.ok) throw new Error(`Презентация не найдена: ${presentationPath}`);
            return res.text();
          })
          .then(html => {
            container.innerHTML = html;
            // Если в презентации есть скрипты — они выполнятся автоматически
            // Можно добавить стили для встроенной презентации
          })
          .catch(err => {
            container.innerHTML = `
              <div style="padding: 40px; text-align: center; background: var(--visual); border-radius: var(--radius);">
                <p style="font-size: 1.2rem; color: #b00;">⚠️ ${err.message}</p>
                <p style="margin-top: 12px; color: #666;">Файл презентации: ${presentationPath}</p>
                <a href="projects.html" style="display:inline-block; margin-top:20px; color:var(--accent);">← Назад к проектам</a>
              </div>
            `;
            console.error(err);
          });
        return; // Выходим, чтобы не рендерить стандартный шаблон
      }

      // =============================================
      // 2. ТИП: STANDARD и STRATEGY (общий рендеринг)
      // =============================================

      // Базовый HTML
      let html = `
        <h1>${project.title}</h1>
        <p style="font-size:1.1rem; color:#444; margin-bottom: 20px;">${project.description || ''}</p>
      `;

      // ===== РЕНДЕРИМ В ЗАВИСИМОСТИ ОТ ТИПА =====
      if (project.type === 'strategy') {
        // Блоки стратегии
        if (project.strategyBlocks && project.strategyBlocks.length) {
          html += `<div class="strategy-blocks">`;
          project.strategyBlocks.forEach(block => {
            html += `
              <div class="strategy-block">
                ${block.image ? `<img src="${block.image}" alt="${block.name}" class="strategy-image" />` : ''}
                <h3>${block.name}</h3>
                <p>${block.description}</p>
              </div>
            `;
          });
          html += `</div>`;
        }
      } else {
        // STANDARD: метрики и скриншоты
        if (project.metrics) {
          html += `<div class="project-metrics">`;
          Object.entries(project.metrics).forEach(([key, val]) => {
            html += `<div class="metric"><strong>${val}</strong> ${key}</div>`;
          });
          html += `</div>`;
        }

        if (project.screenshots && project.screenshots.length) {
          html += `<div class="screenshots">`;
          project.screenshots.forEach(src => {
            html += `<img src="${src}" alt="screenshot" loading="lazy" />`;
          });
          html += `</div>`;
        }

        if (project.chartLabel && project.chartLabel !== '...') {
          html += `<div class="chart-placeholder">📊 График: ${project.chartLabel}</div>`;
        }
      }

      // ===== КЛЮЧЕВЫЕ РЕЗУЛЬТАТЫ (общие для обоих типов) =====
      if (project.results && project.results.length) {
        html += `<div class="project-results"><h3>Ключевые результаты</h3><ul>`;
        project.results.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }

      // ===== МЕТАДАННЫЕ =====
      html += `
        <p><strong>Компания:</strong> ${project.company || '—'}</p>
        <p><strong>Год:</strong> ${project.year || '—'}</p>
        <p><strong>Роль:</strong> ${project.role || '—'}</p>
        <a href="projects.html" style="display:inline-block; margin-top:20px; color:var(--accent);">← Назад к проектам</a>
      `;

      container.innerHTML = html;
    })
    .catch(err => {
      container.innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
      console.error(err);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('projectsGrid');
  const filterBar = document.getElementById('filterBar');
  let projects = [];
  let companies = [];

  // Загружаем проекты и компании
  Promise.all([
    fetch('data/projects.json').then(r => r.json()),
    fetch('data/companies.json').then(r => r.json())
  ])
    .then(([projectsData, companiesData]) => {
      projects = projectsData;
      companies = companiesData;

      // Строим фильтры
      const companyNames = companies.map(c => c.name);
      const uniqueCompanies = ['Все', ...new Set(companyNames)];
      filterBar.innerHTML = uniqueCompanies.map(name =>
        `<button class="filter-btn ${name === 'Все' ? 'active' : ''}" data-company="${name}">${name}</button>`
      ).join('');

      renderProjects('Все');

      // Фильтрация
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.company);
      });
    })
    .catch(err => {
      grid.innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
      console.error(err);
    });

  function renderProjects(companyFilter) {
    const filtered = companyFilter === 'Все'
      ? projects
      : projects.filter(p => p.company === companyFilter);

    if (!filtered.length) {
      grid.innerHTML = '<p>Нет проектов для этой компании.</p>';
      return;
    }

    grid.innerHTML = filtered.map(project => `
      <div class="card" data-id="${project.id}">
        <h3>${project.title}</h3>
        <p>${project.description || ''}</p>
        <span class="badge">${project.company || '—'}</span>
        <div class="meta">${project.year || ''} · ${project.role || ''}</div>
      </div>
    `).join('');

    // Клик по карточке → переход на детальную страницу
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        window.location.href = `project-detail.html?id=${id}`;
      });
    });
  }
});
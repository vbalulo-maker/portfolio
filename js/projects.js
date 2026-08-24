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

    grid.innerHTML = filtered.map(project => {
      // Ищем логотип в companies.json по совпадению company
      const company = companies.find(c => c.name === project.company);
      const logo = company?.logo || project.logo || 'assets/images/logos/default-logo.png';

      return `
        <div class="card" data-id="${project.id}">
          <div class="card-header">
            <img class="card-logo" src="${logo}" alt="${project.company || 'Проект'}" />
            <div class="card-title-group">
              <h3>${project.title}</h3>
              <p class="card-role">${project.role || ''}</p>
            </div>
            <span class="card-period">${project.year || ''}</span>
          </div>
          <p class="card-description">${project.intro || project.description || ''}</p>
          <a href="project-detail.html?id=${project.id}" class="card-link">Подробнее →</a>
        </div>
      `;
    }).join('');

    // Обработчик клика по ссылке "Подробнее"
    document.querySelectorAll('.card-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }
});

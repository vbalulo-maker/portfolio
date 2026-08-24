document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('companiesGrid');
  if (!grid) return;

  fetch('data/companies.json')
    .then(res => {
      if (!res.ok) throw new Error('Ошибка загрузки компаний');
      return res.json();
    })
    .then(data => {
      grid.innerHTML = data.map(company => `
        <div class="card" data-id="${company.id}">
          <div class="card-header">
            <img class="card-logo" src="${company.logo || 'assets/images/logos/default-logo.png'}" alt="${company.name}" />
            <div class="card-title-group">
              <h3>${company.name}</h3>
              <p class="card-role">${company.role || ''}</p>
            </div>
            <span class="card-period">${company.period || ''}</span>
          </div>
          <p class="card-description">${company.intro || company.description || ''}</p>
          <a href="projects.html?company=${encodeURIComponent(company.name)}" class="card-link">Подробнее →</a>
        </div>
      `).join('');

      // Обработчик клика по ссылке "Подробнее"
      document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation(); // Чтобы не сработал клик по карточке
        });
      });
    })
    .catch(err => {
      grid.innerHTML = `<p style="color:#b00;">⚠️ ${err.message}</p>`;
      console.error(err);
    });

  // Языковой переключатель (заглушка)
  const langBtn = document.getElementById('langSwitch');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = langBtn.textContent.trim();
      if (current.startsWith('🌐 RU')) {
        langBtn.textContent = '🌐 EN';
        console.log('Switch to EN');
      } else {
        langBtn.textContent = '🌐 RU';
        console.log('Switch to RU');
      }
    });
  }
});

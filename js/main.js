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
          <h3>${company.name}</h3>
          <p>${company.description || ''}</p>
          <span class="badge">${company.industry || 'General'}</span>
          <div class="meta">${company.location || ''}</div>
        </div>
      `).join('');

      // Клик по карточке → переход на project-detail.html?id=project-1
      document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          // Для примера используем project-1, но можно маппить компании → проекты
          window.location.href = `project-detail.html?id=project-1`;
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
        // Здесь будет логика перевода
        console.log('Switch to EN');
      } else {
        langBtn.textContent = '🌐 RU';
        console.log('Switch to RU');
      }
    });
  }
});
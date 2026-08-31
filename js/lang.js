// js/lang.js — Управление переключением языка

document.addEventListener('DOMContentLoaded', () => {
    // Определяем текущий язык из URL или localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    const storedLang = localStorage.getItem('preferredLang');
    
    // Приоритет: параметр URL > localStorage > 'ru' по умолчанию
    let currentLang = langParam || storedLang || 'ru';
    
    // Проверяем, что язык валидный
    if (!['ru', 'en'].includes(currentLang)) {
        currentLang = 'ru';
    }
    
    // Применяем язык
    setLanguage(currentLang);
    
    // Обработчик клика по переключателю
    document.querySelectorAll('.lang-switch').forEach(sw => {
        sw.addEventListener('click', (e) => {
            const target = e.target.closest('.lang-inactive, .lang-active');
            if (!target) return;
            
            // Если кликнули на активный — ничего не делаем
            if (target.classList.contains('lang-active')) return;
            
            // Иначе переключаем на другой язык
            const newLang = target.textContent.trim().toLowerCase();
            switchLanguage(newLang);
        });
    });
    
    function setLanguage(lang) {
        // Обновляем активный/неактивный классы
        document.querySelectorAll('.lang-switch').forEach(sw => {
            const ru = sw.querySelector('.lang-ru');
            const en = sw.querySelector('.lang-en');
            if (ru) ru.className = lang === 'ru' ? 'lang-active' : 'lang-inactive';
            if (en) en.className = lang === 'en' ? 'lang-active' : 'lang-inactive';
        });
        
        // Сохраняем в localStorage
        localStorage.setItem('preferredLang', lang);
    }
    
    function switchLanguage(lang) {
    const currentPath = window.location.pathname;
    const isEnglish = currentPath.includes('.en.html');
    
    // Если текущая страница уже на нужном языке, ничего не делаем
    if ((lang === 'en' && isEnglish) || (lang === 'ru' && !isEnglish)) {
        return;
    }
    
    // Определяем базовое имя файла
    let baseFile = currentPath.split('/').pop();
    if (baseFile.includes('.en.')) {
        baseFile = baseFile.replace('.en.html', '.html');
    } else {
        baseFile = baseFile.replace('.html', '.en.html');
    }
    
    // Сохраняем параметры URL (id, company)
    const params = new URLSearchParams(window.location.search);
    const queryString = params.toString() ? '?' + params.toString() : '';
    
    // Формируем новый URL
    let newUrl = baseFile + queryString;
    
    // Добавляем параметр lang для единообразия
    if (!queryString.includes('lang=')) {
        newUrl += (queryString ? '&' : '?') + 'lang=' + lang;
    }
    
    window.location.href = newUrl;
}
});

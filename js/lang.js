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
        // Определяем текущую страницу
        const currentPath = window.location.pathname;
        const isIndex = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');
        const isProjects = currentPath.includes('projects.html');
        const isProjectDetail = currentPath.includes('project-detail.html');
        const isAIChat = currentPath.includes('ai-chat.html');
        
        // Определяем базовое имя файла для перехода
        let baseFile = '';
        if (isIndex) baseFile = 'index';
        else if (isProjects) baseFile = 'projects';
        else if (isAIChat) baseFile = 'ai-chat';
        else if (isProjectDetail) baseFile = 'project-detail';
        else {
            // Если страница не распознана — перезагружаем с параметром lang
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.location.href = url.href;
            return;
        }
        
        // Формируем новый URL
        let newPath = '';
        if (lang === 'en') {
            newPath = baseFile + '.en.html';
        } else {
            newPath = baseFile + '.html';
        }
        
        // Если мы на project-detail, сохраняем параметр id
        if (isProjectDetail) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            window.location.href = `${newPath}?id=${id}&lang=${lang}`;
        } else {
            window.location.href = newPath + '?lang=' + lang;
        }
    }
});
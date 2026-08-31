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
        // Получаем текущий путь
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'index.html';
        
        // Определяем, на какой странице мы находимся (без учета языка)
        let baseFile = fileName;
        
        // Убираем .en. если есть
        if (baseFile.includes('.en.')) {
            baseFile = baseFile.replace('.en.', '.');
        }
        
        // Если файл без расширения или это index, подставляем .html
        if (!baseFile.includes('.html')) {
            baseFile = baseFile + '.html';
        }
        
        // Формируем новое имя файла
        let newFile;
        if (lang === 'en') {
            // Если это index.html, меняем на index.en.html
            if (baseFile === 'index.html') {
                newFile = 'index.en.html';
            } else {
                // Для других файлов вставляем .en. перед .html
                newFile = baseFile.replace('.html', '.en.html');
            }
        } else {
            // Возвращаемся к базовому имени
            newFile = baseFile;
        }
        
        // Сохраняем параметры URL (id, company)
        const params = new URLSearchParams(window.location.search);
        // Удаляем параметр lang, если он есть
        params.delete('lang');
        
        // Формируем новый URL
        let newPath = window.location.pathname.replace(fileName, '') + newFile;
        const queryString = params.toString();
        if (queryString) {
            newPath += '?' + queryString + '&lang=' + lang;
        } else {
            newPath += '?lang=' + lang;
        }
        
        // Перенаправляем
        window.location.href = newPath;
    }
});

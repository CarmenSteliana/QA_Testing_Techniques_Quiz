// Main router and orchestrator
const pages = {
    home: { html: 'sections/home.html', json: 'data/home.json', js: './home.js' },
    blackbox: { html: 'sections/blackbox.html', json: 'data/blackbox.json', js: './blackbox.js' },
    whitebox: { html: 'sections/whitebox.html', json: 'data/whitebox.json', js: './whitebox.js' },
    experience: { html: 'sections/experience.html', json: 'data/experience.json', js: './experience.js' },
    quiz: { html: 'sections/quiz.html', json: 'data/quiz.json', js: './quiz.js' }
};

let currentPage = null;

// Display a premium banner warning if accessed via file:// due to CORS
function checkCORS() {
    if (window.location.protocol === 'file:') {
        const warningBanner = document.createElement('div');
        warningBanner.className = 'bg-amber-100 dark:bg-amber-950 border-b border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200 px-4 py-3 text-center fixed top-0 left-0 w-full z-50 flex justify-between items-center shadow-md';
        warningBanner.innerHTML = `
            <span class="font-semibold flex items-center justify-center gap-2 mx-auto text-xs md:text-sm">
                ⚠️ <strong>Restricție CORS:</strong> Această aplicație modulară necesită un server local (ex. Live Server în VS Code) pentru a se încărca dinamic.
            </span>
            <button onclick="this.parentElement.remove()" class="text-amber-800 dark:text-amber-400 hover:text-amber-950 font-bold px-3">✕</button>
        `;
        document.body.appendChild(warningBanner);
        console.warn("Restricție CORS detectată. Utilizați un server web local.");
    }
}

// Responsive menu controls
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sidebarAside = document.getElementById('sidebar-aside');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function openMenu() {
        menuToggle.classList.add('active');
        sidebarAside.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden');
        setTimeout(() => {
            sidebarOverlay.classList.add('opacity-100');
        }, 10);
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        sidebarAside.classList.add('-translate-x-full');
        sidebarOverlay.classList.remove('opacity-100');
        sidebarOverlay.classList.add('opacity-0');
        setTimeout(() => {
            sidebarOverlay.classList.add('hidden');
        }, 300);
    }

    menuToggle.addEventListener('click', () => {
        if (sidebarAside.classList.contains('-translate-x-full')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMenu);

    // Close on navigation click on mobile
    document.querySelectorAll('#sidebar-nav button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });
}

// Dark Mode Toggle Logic
function initDarkMode() {
    const desktopBtn = document.getElementById('theme-toggle-desktop');
    const mobileBtn = document.getElementById('theme-toggle-mobile');

    const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

    const themeText = document.getElementById('theme-text');
    const themeTextIcon = document.getElementById('theme-text-icon');

    // Check saved preference or system theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDark(true);
    } else {
        setDark(false);
    }

    function setDark(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');

            // Update mobile icons
            if (darkIconMobile) darkIconMobile.classList.add('hidden');
            if (lightIconMobile) lightIconMobile.classList.remove('hidden');

            // Update desktop text
            if (themeText) themeText.textContent = "Mod Întunecat";
            if (themeTextIcon) themeTextIcon.textContent = "🌙";
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');

            // Update mobile icons
            if (darkIconMobile) darkIconMobile.classList.remove('hidden');
            if (lightIconMobile) lightIconMobile.classList.add('hidden');

            // Update desktop text
            if (themeText) themeText.textContent = "Mod Luminos";
            if (themeTextIcon) themeTextIcon.textContent = "☀️";
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        setDark(!isDark);
    }

    if (desktopBtn) desktopBtn.addEventListener('click', toggleTheme);
    if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);
}

function highlightMenuButton(pageId) {
    const navButtons = document.querySelectorAll('#sidebar-nav button[data-page]');
    navButtons.forEach(btn => {
        // Remove all active states classes
        btn.classList.remove(
            'bg-indigo-50', 'dark:bg-indigo-950/40', 'text-indigo-700', 'dark:text-indigo-400', 'border-l-2', 'border-l-indigo-600', 'dark:border-l-indigo-500',
            'bg-emerald-50', 'dark:bg-emerald-950/40', 'text-emerald-700', 'dark:text-emerald-400', 'border-l-emerald-600', 'dark:border-l-emerald-500',
            'bg-amber-50', 'dark:bg-amber-950/40', 'text-amber-700', 'dark:text-amber-400', 'border-l-amber-600', 'dark:border-l-amber-500',
            'bg-purple-50', 'dark:bg-purple-950/40', 'text-purple-700', 'dark:text-purple-400', 'border-l-purple-600', 'dark:border-l-purple-500',
            'font-bold'
        );
        // Add normal state classes
        btn.classList.remove('text-slate-900', 'dark:text-slate-100');
        btn.classList.add('text-slate-500', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800', 'hover:text-slate-900', 'dark:hover:text-slate-100');
    });

    const activeBtn = document.querySelector(`#sidebar-nav button[data-page="${pageId}"]`);
    if (activeBtn) {
        // Remove hover styles from active button
        activeBtn.classList.remove('text-slate-500', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800', 'hover:text-slate-900', 'dark:hover:text-slate-100');
        
        // Add active classes matching the page theme
        switch (pageId) {
            case 'home':
            case 'blackbox':
                activeBtn.classList.add('bg-indigo-50', 'dark:bg-indigo-950/40', 'text-indigo-700', 'dark:text-indigo-400', 'border-l-2', 'border-l-indigo-600', 'dark:border-l-indigo-500', 'font-bold');
                break;
            case 'whitebox':
                activeBtn.classList.add('bg-emerald-50', 'dark:bg-emerald-950/40', 'text-emerald-700', 'dark:text-emerald-400', 'border-l-2', 'border-l-emerald-600', 'dark:border-l-emerald-500', 'font-bold');
                break;
            case 'experience':
                activeBtn.classList.add('bg-amber-50', 'dark:bg-amber-950/40', 'text-amber-700', 'dark:text-amber-400', 'border-l-2', 'border-l-amber-600', 'dark:border-l-amber-500', 'font-bold');
                break;
            case 'quiz':
                activeBtn.classList.add('bg-purple-50', 'dark:bg-purple-950/40', 'text-purple-700', 'dark:text-purple-400', 'border-l-2', 'border-l-purple-600', 'dark:border-l-purple-500', 'font-bold');
                break;
        }
    }
}

async function showPage(pageId) {
    if (!pages[pageId]) return;
    
    currentPage = pageId;
    highlightMenuButton(pageId);
    
    const mainEl = document.getElementById('main-content');
    
    // Visual transition fade-out
    mainEl.style.opacity = '0';
    mainEl.style.transition = 'opacity 0.12s ease-in-out';
    
    // Short timeout to let fade-out complete before updating DOM
    setTimeout(async () => {
        try {
            // Fetch HTML template
            const htmlRes = await fetch(pages[pageId].html);
            if (!htmlRes.ok) throw new Error(`Nu s-a putut încărca template-ul HTML pentru ${pageId}`);
            const htmlContent = await htmlRes.text();
            
            // Fetch JSON data
            const jsonRes = await fetch(pages[pageId].json);
            if (!jsonRes.ok) throw new Error(`Nu s-a putut încărca fișierul JSON pentru ${pageId}`);
            const jsonData = await jsonRes.json();
            
            // Load page-specific JS module dynamically
            const module = await import(pages[pageId].js);
            
            // Render content
            mainEl.innerHTML = htmlContent;
            module.default(jsonData);
            
            // Trigger PrismJS syntax highlighting if it loaded
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
            
            // Visual transition fade-in
            mainEl.style.opacity = '1';
        } catch (err) {
            console.error(err);
            mainEl.innerHTML = `
                <div class="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg text-red-900 dark:text-red-200 shadow-md">
                    <h2 class="text-xl font-bold mb-2">Eroare de Încărcare</h2>
                    <p class="mb-4">${err.message}</p>
                    <div class="text-xs bg-red-100 dark:bg-red-900/50 p-3 rounded font-mono">
                        Verifică dacă rulezi aplicația folosind un server local (Live Server / node/npx server). Paginile dinamice nu pot fi încărcate direct din browser prin file://.
                    </div>
                </div>
            `;
            mainEl.style.opacity = '1';
        }
    }, 120);
}

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    checkCORS();
    initMobileMenu();
    initDarkMode();
    
    // Bind click events to navigation buttons
    document.querySelectorAll('nav button[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageId = e.currentTarget.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Load home page initially
    showPage('home');
});

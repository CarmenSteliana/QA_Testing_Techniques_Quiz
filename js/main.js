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
        warningBanner.className = 'bg-amber-100 border-b border-amber-300 text-amber-900 px-4 py-3 text-center fixed top-0 left-0 w-full z-50 flex justify-between items-center shadow-md';
        warningBanner.innerHTML = `
            <span class="font-semibold flex items-center justify-center gap-2 mx-auto">
                ⚠️ <strong>Restricție Browser (CORS):</strong> Aplicația utilizează o structură modulară modernă care necesită un server local pentru a se încărca dinamic. Deschideți directorul în VS Code și rulați cu 'Live Server' sau lansați 'npx http-server' în terminal.
            </span>
            <button onclick="this.parentElement.remove()" class="text-amber-800 hover:text-amber-950 font-bold px-3">✕</button>
        `;
        document.body.appendChild(warningBanner);
        console.warn("Restricție CORS detectată. Utilizați un server web local (ex. Live Server sau npx http-server) pentru a asigura încărcarea dinamică a fișierelor HTML și JSON.");
    }
}

function highlightMenuButton(pageId) {
    const navButtons = document.querySelectorAll('#sidebar-nav button[data-page]');
    navButtons.forEach(btn => {
        // Remove all active states classes
        btn.classList.remove(
            'bg-indigo-950/45', 'text-indigo-400', 'border', 'border-indigo-900/50',
            'bg-emerald-950/45', 'text-emerald-400', 'border-emerald-900/50',
            'bg-amber-950/45', 'text-amber-400', 'border-amber-900/50',
            'bg-purple-950/45', 'text-purple-400', 'border-purple-900/50',
            'bg-indigo-50', 'text-indigo-700', 'border-l-2', 'border-l-indigo-600',
            'bg-emerald-50', 'text-emerald-700', 'border-l-emerald-600',
            'bg-amber-50', 'text-amber-700', 'border-l-amber-600',
            'bg-purple-50', 'text-purple-700', 'border-l-purple-600',
            'font-bold'
        );
        // Add normal state classes
        btn.classList.remove('text-slate-100');
        btn.classList.add('text-slate-500', 'hover:bg-slate-200/50', 'hover:text-slate-900');
    });

    const activeBtn = document.querySelector(`#sidebar-nav button[data-page="${pageId}"]`);
    if (activeBtn) {
        // Remove hover styles from active button
        activeBtn.classList.remove('text-slate-500', 'hover:bg-slate-200/50', 'hover:text-slate-900');
        
        // Add active classes matching the page theme
        switch (pageId) {
            case 'home':
            case 'blackbox':
                activeBtn.classList.add('bg-indigo-50', 'text-indigo-700', 'border-l-2', 'border-l-indigo-600', 'font-bold');
                break;
            case 'whitebox':
                activeBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-l-2', 'border-l-emerald-600', 'font-bold');
                break;
            case 'experience':
                activeBtn.classList.add('bg-amber-50', 'text-amber-700', 'border-l-2', 'border-l-amber-600', 'font-bold');
                break;
            case 'quiz':
                activeBtn.classList.add('bg-purple-50', 'text-purple-700', 'border-l-2', 'border-l-purple-600', 'font-bold');
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
    mainEl.style.transition = 'opacity 0.15s ease-in-out';
    
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
            
            // Visual transition fade-in
            mainEl.style.opacity = '1';
        } catch (err) {
            console.error(err);
            mainEl.innerHTML = `
                <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-red-900 shadow-md">
                    <h2 class="text-xl font-bold mb-2">Eroare de Încărcare</h2>
                    <p class="mb-4">${err.message}</p>
                    <div class="text-xs bg-red-100 p-3 rounded font-mono">
                        Verifică dacă rulezi aplicația folosind un server local (Live Server / node/npx server). Paginile dinamice nu pot fi încărcate folosind schema de adrese file:// direct din browser.
                    </div>
                </div>
            `;
            mainEl.style.opacity = '1';
        }
    }, 150);
}

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    checkCORS();
    
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

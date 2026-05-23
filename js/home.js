export default function initHome(data) {
    const titleEl = document.getElementById('home-title');
    titleEl.className = "text-4xl md:text-5xl font-extrabold mb-4 text-indigo-950 tracking-tight";
    titleEl.textContent = data.title;
    
    const welcomeEl = document.getElementById('home-welcome');
    welcomeEl.className = "text-base md:text-lg mb-8 text-slate-600 leading-relaxed font-semibold max-w-2xl";
    welcomeEl.textContent = data.welcomeMessage;
    
    const container = document.getElementById('home-cards');
    
    // Inject Stats Panel
    let statsPanel = document.getElementById('home-stats');
    if (statsPanel) {
        statsPanel.remove();
    }
    
    statsPanel = document.createElement('div');
    statsPanel.id = 'home-stats';
    statsPanel.className = "grid grid-cols-3 gap-4 mb-10 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm";
    statsPanel.innerHTML = `
        <div class="flex flex-col items-center justify-center p-3 text-center border-r border-slate-200/60">
            <span class="text-2xl mb-1">🖥️</span>
            <span class="text-base md:text-lg font-extrabold text-slate-800">3 Module</span>
            <span class="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">Design Interactiv</span>
        </div>
        <div class="flex flex-col items-center justify-center p-3 text-center border-r border-slate-200/60">
            <span class="text-2xl mb-1">🧪</span>
            <span class="text-base md:text-lg font-extrabold text-slate-800">3 Tehnici</span>
            <span class="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">Exemple Reale</span>
        </div>
        <div class="flex flex-col items-center justify-center p-3 text-center">
            <span class="text-2xl mb-1">🎯</span>
            <span class="text-base md:text-lg font-extrabold text-slate-800">11 Exerciții</span>
            <span class="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">Practice QA</span>
        </div>
    `;
    container.parentNode.insertBefore(statsPanel, container);

    container.innerHTML = data.cards.map(card => {
        let borderClass = "";
        let textTitleClass = "";
        let badge = "";
        let ctaTextClass = "";
        let targetPage = "";
        
        if (card.borderColor.includes('indigo')) {
            borderClass = "hover:border-l-indigo-400 hover:shadow-indigo-100/40 border-l-4 border-l-indigo-600";
            textTitleClass = "group-hover:text-indigo-700";
            badge = `<span class="inline-block text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full mb-3.5 border border-indigo-100/60">Capitolul 1 &bull; Black Box</span>`;
            ctaTextClass = "text-indigo-600";
            targetPage = "blackbox";
        } else if (card.borderColor.includes('emerald')) {
            borderClass = "hover:border-l-emerald-400 hover:shadow-emerald-100/40 border-l-4 border-l-emerald-600";
            textTitleClass = "group-hover:text-emerald-700";
            badge = `<span class="inline-block text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-3.5 border border-emerald-100/60">Capitolul 2 &bull; White Box</span>`;
            ctaTextClass = "text-emerald-600";
            targetPage = "whitebox";
        } else if (card.borderColor.includes('amber')) {
            borderClass = "hover:border-l-amber-400 hover:shadow-amber-100/40 border-l-4 border-l-amber-600";
            textTitleClass = "group-hover:text-amber-700";
            badge = `<span class="inline-block text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full mb-3.5 border border-amber-100/60">Capitolul 3 &bull; Experiență</span>`;
            ctaTextClass = "text-amber-600";
            targetPage = "experience";
        }
        
        return `
            <div data-home-nav="${targetPage}" class="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/60 ${borderClass} shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col justify-between">
                <div>
                    ${badge}
                    <h2 class="text-xl font-extrabold mb-2.5 text-slate-900 ${textTitleClass} transition-colors tracking-tight">${card.title}</h2>
                    <p class="text-sm text-slate-600 font-semibold leading-relaxed">${card.description}</p>
                </div>
                <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-xs font-bold ${ctaTextClass} flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Începe studiul ➔
                    </span>
                </div>
            </div>
        `;
    }).join('');

    // Bind click events to automatically navigate
    container.querySelectorAll('[data-home-nav]').forEach(cardEl => {
        cardEl.addEventListener('click', () => {
            const targetPage = cardEl.getAttribute('data-home-nav');
            const navBtn = document.querySelector(`#sidebar-nav button[data-page="${targetPage}"]`);
            if (navBtn) {
                navBtn.click();
            }
        });
    });
}

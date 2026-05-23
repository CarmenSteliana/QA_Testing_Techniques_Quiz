export default function initExperience(data) {
    const titleEl = document.getElementById('exp-title');
    titleEl.className = "text-3xl md:text-4xl font-extrabold mb-8 text-amber-950 tracking-tight";
    titleEl.textContent = data.title;
    
    function getSvgIcon(id) {
        switch (id) {
            case 'exploratory':
                return `<svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>`;
            case 'error-guessing':
                return `<svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22a10 10 0 100-20 10 10 0 000 20zm0-2a8 8 0 110-16 8 8 0 010 16zm0-10a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z"></path></svg>`;
            case 'checklist-based':
                return `<svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>`;
            default:
                return `<svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        }
    }

    const gridEl = document.getElementById('exp-grid');
    gridEl.innerHTML = data.items.map(item => `
        <div class="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 border-l-4 border-l-amber-600 hover:border-l-amber-400 hover:shadow-xl hover:shadow-amber-100/40 hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-3.5 mb-4">
                    <div class="p-3 bg-amber-50 border border-amber-100/60 rounded-xl group-hover:bg-amber-100/50 transition-colors shadow-sm">
                        ${getSvgIcon(item.id)}
                    </div>
                    <h3 class="text-xl font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors tracking-tight">${item.title}</h3>
                </div>
                <p class="text-sm text-slate-600 mb-2 leading-relaxed font-semibold">${item.description}</p>
                
                <!-- Collapsible Details -->
                <div id="details-${item.id}" class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out opacity-0">
                    <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs text-slate-800 leading-relaxed font-bold shadow-inner">
                            <strong class="text-amber-950 font-extrabold block mb-1">📅 Când se Aplică:</strong> 
                            ${item.when}
                        </div>
                        <div class="bg-amber-50/30 p-3.5 rounded-xl border border-amber-100/40 text-xs text-amber-900 leading-relaxed font-bold shadow-inner">
                            <strong class="text-slate-950 font-extrabold block mb-1">💡 Exemplu Practic:</strong> 
                            ${item.example}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Button -->
            <div class="mt-6 border-t border-slate-100 pt-4">
                <button data-toggle="details-${item.id}" class="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 border border-amber-100/50 shadow-sm transition-all active:scale-[0.98]">
                    <span>Vezi Scenarii & Exemplu</span>
                    <svg class="w-4 h-4 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // Bind click events to toggle buttons
    gridEl.querySelectorAll('button[data-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-toggle');
            const targetEl = document.getElementById(targetId);
            const iconSvg = btn.querySelector('svg');
            const textSpan = btn.querySelector('span');
            
            if (targetEl.classList.contains('active')) {
                // Collapse
                targetEl.style.maxHeight = '0';
                targetEl.style.opacity = '0';
                targetEl.classList.remove('active');
                iconSvg.classList.remove('rotate-180');
                textSpan.textContent = "Vezi Scenarii & Exemplu";
                btn.classList.remove('bg-amber-100', 'text-amber-900');
                btn.classList.add('bg-amber-50', 'text-amber-700');
            } else {
                // Expand
                targetEl.classList.add('active');
                targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
                targetEl.style.opacity = '1';
                iconSvg.classList.add('rotate-180');
                textSpan.textContent = "Ascunde Detaliile";
                btn.classList.add('bg-amber-100', 'text-amber-900');
                btn.classList.remove('bg-amber-50', 'text-amber-700');
            }
        });
    });
}

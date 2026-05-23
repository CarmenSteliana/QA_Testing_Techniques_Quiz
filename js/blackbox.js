export default function initBlackbox(data) {
    const titleEl = document.getElementById('bb-title');
    titleEl.className = "text-3xl md:text-4xl font-extrabold mb-4 text-indigo-950 dark:text-slate-50 tracking-tight";
    titleEl.textContent = data.title;
    
    const descEl = document.getElementById('bb-desc');
    descEl.className = "mb-8 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-3xl";
    descEl.innerHTML = `Aceste tehnici au fost abordate în cadrul cursului de <a href="${data.courseLink}" target="_blank" class="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">Testare Funcțională</a>. <a href="${data.courseLink}" target="_blank" class="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 underline transition-colors">Accesează cursul aici</a> pentru a vedea detaliile. Acum le aplicăm și în testarea non-funcțională pentru a asigura robustețea sistemului.`;
    
    function getSvgIcon(id) {
        switch (id) {
            case 'compatibility':
                return `<svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`;
            case 'usability':
                return `<svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
            case 'security':
                return `<svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 022 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`;
            case 'performance':
                return `<svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
            default:
                return `<svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`;
        }
    }

    const gridEl = document.getElementById('bb-grid');
    gridEl.innerHTML = data.items.map(item => `
        <div class="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 border-l-4 border-l-indigo-600 dark:border-l-indigo-500 hover:border-l-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-3.5 mb-4">
                    <div class="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/50 rounded-xl group-hover:bg-indigo-100/50 dark:group-hover:bg-indigo-900/50 transition-colors shadow-sm">
                        ${getSvgIcon(item.id)}
                    </div>
                    <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-50 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors tracking-tight">${item.title}</h3>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-2 leading-relaxed font-semibold">${item.description}</p>
                
                <!-- Collapsible Details -->
                <div id="details-${item.id}" class="max-h-0 overflow-hidden active-collapse opacity-0">
                    <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-3">
                        <div class="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-bold shadow-inner">
                            <strong class="text-indigo-950 dark:text-indigo-300 font-extrabold block mb-1">🔍 Tehnică Aplicată:</strong> 
                            ${item.technique}
                        </div>
                        <div class="bg-indigo-50/30 dark:bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-100/40 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed font-bold shadow-inner">
                            <strong class="text-slate-950 dark:text-slate-200 font-extrabold block mb-1">💡 Exemplu Practic:</strong> 
                            ${item.example}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Button -->
            <div class="mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <button data-toggle="details-${item.id}" class="w-full py-2.5 px-4 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 border border-indigo-100/50 dark:border-indigo-900/40 shadow-sm transition-all active:scale-[0.98]">
                    <span>Afișează Detalii Tehnice</span>
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
                textSpan.textContent = "Afișează Detalii Tehnice";
                btn.classList.remove('bg-indigo-150', 'dark:bg-indigo-900/80', 'text-indigo-900', 'dark:text-indigo-100');
                btn.classList.add('bg-indigo-50', 'dark:bg-indigo-950/60', 'text-indigo-700', 'dark:text-indigo-300');
            } else {
                // Expand
                targetEl.classList.add('active');
                targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
                targetEl.style.opacity = '1';
                iconSvg.classList.add('rotate-180');
                textSpan.textContent = "Ascunde Detaliile";
                btn.classList.add('bg-indigo-150', 'dark:bg-indigo-900/80', 'text-indigo-900', 'dark:text-indigo-100');
                btn.classList.remove('bg-indigo-50', 'dark:bg-indigo-950/60', 'text-indigo-700', 'dark:text-indigo-300');
            }
        });
    });
}

export default function initWhitebox(data) {
    const titleEl = document.getElementById('wb-title');
    titleEl.className = "text-3xl md:text-4xl font-extrabold mb-4 text-emerald-950 dark:text-slate-50 tracking-tight";
    titleEl.textContent = data.title;

    const descEl = document.getElementById('wb-desc');
    if (descEl) {
        descEl.className = "mb-8 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-3xl";
        descEl.textContent = data.description;
    }

    function getSvgIcon(id) {
        switch (Number(id)) {
            case 1: // Statement Coverage
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
            case 2: // Decision Coverage
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>`;
            case 3: // Path Coverage
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>`;
            case 4: // Condition Coverage
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>`;
            case 5: // Multiple Condition Coverage
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>`;
            case 6: // Loop Coverage
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"></path></svg>`;
            default:
                return `<svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`;
        }
    }

    const gridEl = document.getElementById('wb-grid');
    gridEl.innerHTML = data.items.map(item => `
        <div class="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 border-l-4 border-l-emerald-600 dark:border-l-emerald-500 hover:border-l-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-3.5 mb-4">
                    <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/60 dark:border-emerald-900/50 rounded-xl group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-900/50 transition-colors shadow-sm animate-pulse-slow">
                        ${getSvgIcon(item.id)}
                    </div>
                    <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors tracking-tight">${item.title}</h3>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-semibold">${item.description}</p>
                
                <!-- Code Block (Visual Console style with Prism Support) -->
                <div class="relative mb-4">
                    <div class="absolute top-3.5 right-4 flex items-center gap-1.5 z-10">
                        <span class="w-2 h-2 rounded-full bg-red-400/80"></span>
                        <span class="w-2 h-2 rounded-full bg-yellow-400/80"></span>
                        <span class="w-2 h-2 rounded-full bg-green-400/80"></span>
                    </div>
                    <pre class="language-javascript"><code class="language-javascript">${item.code}</code></pre>
                </div>
                
                <!-- Collapsible Details -->
                <div id="details-${item.id}" class="max-h-0 overflow-hidden active-collapse opacity-0">
                    <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-3">
                        <div class="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-bold shadow-inner">
                            <strong class="text-emerald-950 dark:text-emerald-300 font-extrabold block mb-1">📖 Definiție Completă:</strong> 
                            ${item.definition}
                        </div>
                        <div class="bg-emerald-50/30 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100/40 dark:border-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-bold shadow-inner">
                            <strong class="text-slate-950 dark:text-slate-200 font-extrabold block mb-1">⚙️ Regulă de Acoperire:</strong> 
                            ${item.coverageRule}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Button -->
            <div class="mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <button data-toggle="details-${item.id}" class="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-100/50 dark:border-emerald-900/40 shadow-sm transition-all active:scale-[0.98]">
                    <span>Vezi Definiție & Regulă</span>
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
                textSpan.textContent = "Vezi Definiție & Regulă";
                btn.classList.remove('bg-emerald-150', 'dark:bg-emerald-900/80', 'text-emerald-900', 'dark:text-emerald-100');
                btn.classList.add('bg-emerald-50', 'dark:bg-emerald-950/60', 'text-emerald-700', 'dark:text-emerald-300');
            } else {
                // Expand
                targetEl.classList.add('active');
                targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
                targetEl.style.opacity = '1';
                iconSvg.classList.add('rotate-180');
                textSpan.textContent = "Ascunde Detaliile";
                btn.classList.add('bg-emerald-150', 'dark:bg-emerald-900/80', 'text-emerald-900', 'dark:text-emerald-100');
                btn.classList.remove('bg-emerald-50', 'dark:bg-emerald-950/60', 'text-emerald-700', 'dark:text-emerald-300');
            }
        });
    });
}

let currentQuizData = null;
let activeAnswers = {};

export default function initQuiz(data) {
    const titleEl = document.getElementById('quiz-title');
    titleEl.className = "text-3xl md:text-4xl font-extrabold mb-8 text-purple-950 tracking-tight";
    titleEl.textContent = data.title;
    
    currentQuizData = data;
    activeAnswers = {}; // Reset states
    
    const container = document.getElementById('quiz-container');
    container.innerHTML = data.questions.map(q => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:border-purple-200 transition-all duration-300 flex flex-col gap-4">
            <h3 class="font-bold text-lg text-slate-900 leading-snug">${q.question}</h3>
            
            ${q.code ? `
            <!-- Code Block (Console style) -->
            <div class="relative mt-2">
                <div class="absolute top-3 right-4 flex items-center gap-1.5 z-10">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
                </div>
                <pre class="bg-slate-900 text-emerald-400 p-4 pt-5 rounded-xl text-xs font-mono border border-slate-800 shadow-inner overflow-x-auto whitespace-pre font-bold block max-w-full">${q.code}</pre>
            </div>
            ` : ''}
            
            <div class="flex flex-col gap-3" id="opts-${q.id}">
                ${q.options.map((opt, idx) => `
                    <button onclick="window.selectQuizOption('${q.id}', ${idx})" class="option-btn text-left p-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-purple-50/70 hover:border-purple-300 transition-all w-full text-slate-700 font-semibold text-sm">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            
            <div class="flex flex-wrap items-center gap-3 mt-2">
                <button id="submit-${q.id}" onclick="window.submitQuizAnswer('${q.id}')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all active:scale-[0.98]">
                    Trimite Răspuns
                </button>
                
                ${q.stepByStep ? `
                <button id="toggle-exp-${q.id}" onclick="window.toggleQuizExplanation('${q.id}')" class="hidden text-purple-700 hover:text-purple-900 font-bold text-xs items-center gap-1.5 transition-all py-2.5 px-4 bg-purple-50 hover:bg-purple-100 rounded-xl active:scale-[0.98] border border-purple-100/50">
                    <span>Vezi Explicația Detaliată</span>
                    <svg class="w-4 h-4 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                ` : ''}
            </div>
            
            <div id="feedback-${q.id}" class="hidden p-4 rounded-xl text-sm font-semibold"></div>
            
            ${q.stepByStep ? `
            <!-- Collapsible Explanation Container -->
            <div id="exp-container-${q.id}" class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out opacity-0">
                <div class="p-5 bg-purple-50/40 border border-purple-100 rounded-xl">
                    <h4 class="font-bold text-purple-950 mb-3 text-xs flex items-center gap-2">
                        💡 Explicație Pas cu Pas (White Box Coverage):
                    </h4>
                    <div class="text-xs text-slate-700 leading-relaxed font-semibold">
                        ${q.stepByStep}
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `).join('');
    
    // Bind global quiz handlers so inline HTML onclicks can invoke them
    window.selectQuizOption = selectQuizOption;
    window.submitQuizAnswer = submitQuizAnswer;
    window.toggleQuizExplanation = toggleQuizExplanation;
}

function selectQuizOption(qId, index) {
    if (activeAnswers[qId]?.submitted) return;
    
    if (!activeAnswers[qId]) {
        activeAnswers[qId] = { selected: null, submitted: false };
    }
    activeAnswers[qId].selected = index;
    
    const buttons = document.querySelectorAll(`#opts-${qId} .option-btn`);
    buttons.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add('border-purple-600', 'bg-purple-50/70', 'ring-2', 'ring-purple-400/80', 'text-purple-900');
            btn.classList.remove('border-slate-200/80', 'bg-white', 'text-slate-700');
        } else {
            btn.classList.remove('border-purple-600', 'bg-purple-50/70', 'ring-2', 'ring-purple-400/80', 'text-purple-900');
            btn.classList.add('border-slate-200/80', 'bg-white', 'text-slate-700');
        }
    });
}

function submitQuizAnswer(qId) {
    const userAns = activeAnswers[qId];
    if (!userAns || userAns.selected === null) {
        alert("Te rog să selectezi o variantă de răspuns înainte de a trimite!");
        return;
    }
    if (userAns.submitted) return;
    
    userAns.submitted = true;
    
    const qData = currentQuizData.questions.find(q => q.id === qId);
    
    const buttons = document.querySelectorAll(`#opts-${qId} .option-btn`);
    const submitBtn = document.getElementById(`submit-${qId}`);
    const feedbackEl = document.getElementById(`feedback-${qId}`);
    
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-40', 'cursor-not-allowed');
    
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.classList.remove('hover:bg-purple-50/70', 'ring-2', 'ring-purple-400/80', 'hover:border-purple-300');
        
        if (idx === qData.correct) {
            btn.classList.remove('border-slate-200/80', 'border-purple-600', 'bg-purple-50/70', 'bg-white', 'text-slate-750');
            btn.classList.add('bg-green-50', 'border-green-500', 'text-green-800', 'ring-2', 'ring-green-400/60');
            btn.innerHTML += ' <span class="float-right text-green-600 font-bold">✓ Corect</span>';
        } else if (idx === userAns.selected) {
            btn.classList.remove('border-slate-200/80', 'border-purple-600', 'bg-purple-50/70', 'bg-white', 'text-slate-750');
            btn.classList.add('bg-red-50', 'border-red-500', 'text-red-800', 'ring-2', 'ring-red-400/60');
            btn.innerHTML += ' <span class="float-right text-red-600 font-bold">✗ Greșit</span>';
        } else {
            btn.classList.add('opacity-40');
        }
    });
    
    feedbackEl.classList.remove('hidden');
    if (userAns.selected === qData.correct) {
        feedbackEl.className = "p-4 rounded-xl text-sm font-semibold bg-green-50 border-l-4 border-green-500 text-green-800 mt-2";
        feedbackEl.innerHTML = `<strong>Excelent!</strong> Răspunsul tău este corect. <br><span class="text-slate-600 mt-1.5 block font-medium">${qData.explanation}</span>`;
    } else {
        feedbackEl.className = "p-4 rounded-xl text-sm font-semibold bg-red-50 border-l-4 border-red-500 text-red-800 mt-2";
        feedbackEl.innerHTML = `<strong>Răspuns incorect!</strong> Varianta corectă era cea evidențiată cu verde. <br><span class="text-slate-600 mt-1.5 block font-medium">${qData.explanation}</span>`;
    }

    // Show the step-by-step explanation button if this question has one
    const toggleExpBtn = document.getElementById(`toggle-exp-${qId}`);
    if (toggleExpBtn) {
        toggleExpBtn.classList.remove('hidden');
        toggleExpBtn.classList.add('inline-flex');
    }
}

function toggleQuizExplanation(qId) {
    const targetEl = document.getElementById(`exp-container-${qId}`);
    const btn = document.getElementById(`toggle-exp-${qId}`);
    if (!targetEl || !btn) return;
    
    const iconSvg = btn.querySelector('svg');
    const textSpan = btn.querySelector('span');
    
    if (targetEl.classList.contains('active')) {
        // Collapse
        targetEl.style.maxHeight = '0';
        targetEl.style.opacity = '0';
        targetEl.classList.remove('active');
        iconSvg.classList.remove('rotate-180');
        textSpan.textContent = "Vezi Explicația Detaliată";
        btn.classList.remove('bg-purple-100', 'text-purple-900');
        btn.classList.add('bg-purple-50', 'text-purple-700');
    } else {
        // Expand
        targetEl.classList.add('active');
        targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
        targetEl.style.opacity = '1';
        iconSvg.classList.add('rotate-180');
        textSpan.textContent = "Ascunde Explicația";
        btn.classList.add('bg-purple-100', 'text-purple-900');
        btn.classList.remove('bg-purple-50', 'text-purple-700');
    }
}

let currentQuizData = null;
let activeAnswers = {};

export default function initQuiz(data) {
    const titleEl = document.getElementById('quiz-title');
    titleEl.className = "text-3xl md:text-4xl font-extrabold mb-8 text-purple-950 dark:text-slate-50 tracking-tight";
    titleEl.textContent = data.title;
    
    currentQuizData = data;
    activeAnswers = {}; // Reset states
    
    const container = document.getElementById('quiz-container');
    
    // Core HTML structure with progress bar and score badge
    const progressHTML = `
        <div id="quiz-progress-container" class="mb-6 p-4 glass-panel rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <span id="quiz-progress-text" class="text-xs font-bold text-slate-600 dark:text-slate-400">Progres: 0 din ${data.questions.length} exerciții evaluate (0%)</span>
                <span id="quiz-score-badge" class="text-xs font-bold px-3 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-lg border border-purple-100/50 dark:border-purple-900/50 shadow-sm">Scor: 0</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div id="quiz-progress-bar" class="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out" style="width: 0%;"></div>
            </div>
        </div>
    `;

    const questionsHTML = data.questions.map(q => `
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 hover:border-purple-200 dark:hover:border-purple-900/80 transition-all duration-300 flex flex-col gap-4">
            <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug">${q.question}</h3>
            
            ${q.code ? `
            <!-- Code Block (Console style with Prism) -->
            <div class="relative mt-2">
                <div class="absolute top-3.5 right-4 flex items-center gap-1.5 z-10">
                    <span class="w-2 h-2 rounded-full bg-red-400/80"></span>
                    <span class="w-2 h-2 rounded-full bg-yellow-400/80"></span>
                    <span class="w-2 h-2 rounded-full bg-green-400/80"></span>
                </div>
                <pre class="language-javascript"><code class="language-javascript">${q.code}</code></pre>
            </div>
            ` : ''}
            
            <div class="flex flex-col gap-3" id="opts-${q.id}">
                ${q.options.map((opt, idx) => `
                    <button onclick="window.selectQuizOption('${q.id}', ${idx})" class="option-btn text-left p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 hover:bg-purple-50/70 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-800 transition-all w-full text-slate-700 dark:text-slate-300 font-semibold text-sm">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            
            <div class="flex flex-wrap items-center gap-3 mt-2">
                <button id="submit-${q.id}" onclick="window.submitQuizAnswer('${q.id}')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-purple-500/10 dark:shadow-none">
                    Trimite Răspuns
                </button>
                
                ${q.stepByStep ? `
                <button id="toggle-exp-${q.id}" onclick="window.toggleQuizExplanation('${q.id}')" class="hidden text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-bold text-xs items-center gap-1.5 transition-all py-2.5 px-4 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-xl active:scale-[0.98] border border-purple-100/50 dark:border-purple-900/40">
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
            <div id="exp-container-${q.id}" class="max-h-0 overflow-hidden active-collapse opacity-0">
                <div class="p-5 bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
                    <h4 class="font-bold text-purple-950 dark:text-purple-300 mb-3 text-xs flex items-center gap-2">
                        💡 Explicație Pas cu Pas (White Box Coverage):
                    </h4>
                    <div class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                        ${q.stepByStep}
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `).join('');

    container.innerHTML = progressHTML + `<div class="space-y-6 mt-6">${questionsHTML}</div>`;
    
    // Bind global quiz handlers so inline HTML onclicks can invoke them
    window.selectQuizOption = selectQuizOption;
    window.submitQuizAnswer = submitQuizAnswer;
    window.toggleQuizExplanation = toggleQuizExplanation;

    // Refresh highlighting for dynamic quiz blocks
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

function updateQuizProgress() {
    const total = currentQuizData.questions.length;
    const answered = Object.keys(activeAnswers).filter(qId => activeAnswers[qId].submitted).length;
    const pct = (answered / total) * 100;
    
    const bar = document.getElementById('quiz-progress-bar');
    const text = document.getElementById('quiz-progress-text');
    const scoreBadge = document.getElementById('quiz-score-badge');
    
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `Progres: ${answered} din ${total} exerciții evaluate (${Math.round(pct)}%)`;
    
    if (scoreBadge) {
        let correctCount = 0;
        Object.keys(activeAnswers).forEach(qId => {
            const qData = currentQuizData.questions.find(q => q.id === qId);
            if (activeAnswers[qId].submitted && activeAnswers[qId].selected === qData.correct) {
                correctCount++;
            }
        });
        scoreBadge.textContent = `Scor: ${correctCount}`;
    }

    // Trigger complete confetti if all questions are evaluated
    if (answered === total) {
        let correctCount = 0;
        Object.keys(activeAnswers).forEach(qId => {
            const qData = currentQuizData.questions.find(q => q.id === qId);
            if (activeAnswers[qId].selected === qData.correct) {
                correctCount++;
            }
        });

        if (typeof confetti !== 'undefined') {
            setTimeout(() => {
                let duration = 3 * 1000;
                let end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 4,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0, y: 0.8 }
                    });
                    confetti({
                        particleCount: 4,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1, y: 0.8 }
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }, 400);
        }
    }
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
            btn.className = "option-btn text-left p-3.5 rounded-xl border-2 border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/45 ring-2 ring-purple-400 dark:ring-purple-500/50 text-purple-900 dark:text-purple-200 font-semibold text-sm w-full";
        } else {
            btn.className = "option-btn text-left p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 hover:bg-purple-50/70 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-800 transition-all w-full text-slate-700 dark:text-slate-300 font-semibold text-sm";
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
    const isCorrect = userAns.selected === qData.correct;
    
    // Confetti on single correct answer
    if (isCorrect && typeof confetti !== 'undefined') {
        confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.85 }
        });
    }

    const buttons = document.querySelectorAll(`#opts-${qId} .option-btn`);
    const submitBtn = document.getElementById(`submit-${qId}`);
    const feedbackEl = document.getElementById(`feedback-${qId}`);
    
    submitBtn.disabled = true;
    submitBtn.className = "bg-purple-600/40 text-white/50 font-bold py-2.5 px-6 rounded-xl text-sm cursor-not-allowed shadow-none";
    
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        
        if (idx === qData.correct) {
            btn.className = "option-btn text-left p-3.5 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 ring-2 ring-green-400 dark:ring-green-500/30 font-semibold text-sm w-full";
            btn.innerHTML += ' <span class="float-right text-green-600 dark:text-green-400 font-bold">✓ Corect</span>';
        } else if (idx === userAns.selected) {
            btn.className = "option-btn text-left p-3.5 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 ring-2 ring-red-400 dark:ring-red-500/30 font-semibold text-sm w-full";
            btn.innerHTML += ' <span class="float-right text-red-600 dark:text-red-400 font-bold">✗ Greșit</span>';
        } else {
            btn.className = "option-btn text-left p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 opacity-40 dark:opacity-30 transition-all w-full text-slate-700 dark:text-slate-350 font-semibold text-sm";
        }
    });
    
    feedbackEl.classList.remove('hidden');
    if (isCorrect) {
        feedbackEl.className = "p-4 rounded-xl text-sm font-semibold bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 text-green-800 dark:text-green-300 mt-2";
        feedbackEl.innerHTML = `<strong>Excelent!</strong> Răspunsul tău este corect. <br><span class="text-slate-600 dark:text-slate-400 mt-1.5 block font-medium">${qData.explanation}</span>`;
    } else {
        feedbackEl.className = "p-4 rounded-xl text-sm font-semibold bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-800 dark:text-red-300 mt-2";
        feedbackEl.innerHTML = `<strong>Răspuns incorect!</strong> Varianta corectă era cea evidențiată cu verde. <br><span class="text-slate-600 dark:text-slate-400 mt-1.5 block font-medium">${qData.explanation}</span>`;
    }

    // Show the step-by-step explanation button if this question has one
    const toggleExpBtn = document.getElementById(`toggle-exp-${qId}`);
    if (toggleExpBtn) {
        toggleExpBtn.classList.remove('hidden');
        toggleExpBtn.classList.add('inline-flex');
    }

    // Update progress tracker
    updateQuizProgress();
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
        btn.classList.remove('bg-purple-100', 'dark:bg-purple-900', 'text-purple-900', 'dark:text-purple-100');
        btn.classList.add('bg-purple-50', 'dark:bg-purple-950/50', 'text-purple-700', 'dark:text-purple-300');
    } else {
        // Expand
        targetEl.classList.add('active');
        targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
        targetEl.style.opacity = '1';
        iconSvg.classList.add('rotate-180');
        textSpan.textContent = "Ascunde Explicația";
        btn.classList.add('bg-purple-100', 'dark:bg-purple-900', 'text-purple-900', 'dark:text-purple-100');
        btn.classList.remove('bg-purple-50', 'dark:bg-purple-950/50', 'text-purple-700', 'dark:text-purple-300');
    }
}

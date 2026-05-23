let currentQuizData = null;
let activeAnswers = {};

export default function initQuiz(data) {
    document.getElementById('quiz-title').textContent = data.title;
    currentQuizData = data;
    activeAnswers = {}; // Reset states
    
    const container = document.getElementById('quiz-container');
    container.innerHTML = data.questions.map(q => `
        <div class="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col gap-4">
            <h3 class="font-bold text-lg text-gray-800">${q.question}</h3>
            <div class="flex flex-col gap-3" id="opts-${q.id}">
                ${q.options.map((opt, idx) => `
                    <button onclick="window.selectQuizOption('${q.id}', ${idx})" class="option-btn text-left p-3 rounded-lg border border-gray-200 bg-white hover:bg-purple-50 transition w-full text-gray-700 font-medium">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <div class="flex items-center gap-3">
                <button id="submit-${q.id}" onclick="window.submitQuizAnswer('${q.id}')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition">
                    Trimite Răspuns
                </button>
            </div>
            <div id="feedback-${q.id}" class="hidden p-4 rounded-lg text-sm font-medium"></div>
        </div>
    `).join('');
    
    // Bind global quiz handlers so inline HTML onclicks can invoke them
    window.selectQuizOption = selectQuizOption;
    window.submitQuizAnswer = submitQuizAnswer;
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
            btn.classList.add('border-purple-600', 'bg-purple-50', 'ring-2', 'ring-purple-400');
            btn.classList.remove('border-gray-200', 'bg-white');
        } else {
            btn.classList.remove('border-purple-600', 'bg-purple-50', 'ring-2', 'ring-purple-400');
            btn.classList.add('border-gray-200', 'bg-white');
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
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.classList.remove('hover:bg-purple-50', 'ring-2', 'ring-purple-400');
        
        if (idx === qData.correct) {
            btn.classList.remove('border-gray-200', 'border-purple-600', 'bg-purple-50', 'bg-white');
            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-800', 'ring-2', 'ring-green-400');
            btn.innerHTML += ' <span class="float-right text-green-600 font-bold">✓ Corect</span>';
        } else if (idx === userAns.selected) {
            btn.classList.remove('border-gray-200', 'border-purple-600', 'bg-purple-50', 'bg-white');
            btn.classList.add('bg-red-100', 'border-red-500', 'text-red-800', 'ring-2', 'ring-red-400');
            btn.innerHTML += ' <span class="float-right text-red-600 font-bold">✗ Greșit</span>';
        } else {
            btn.classList.add('opacity-60');
        }
    });
    
    feedbackEl.classList.remove('hidden');
    if (userAns.selected === qData.correct) {
        feedbackEl.classList.add('bg-green-50', 'border-l-4', 'border-green-500', 'text-green-800');
        feedbackEl.innerHTML = `<strong>Excelent!</strong> Răspunsul tău este corect. <br><span class="text-gray-600 mt-1 block">${qData.explanation}</span>`;
    } else {
        feedbackEl.classList.add('bg-red-50', 'border-l-4', 'border-red-500', 'text-red-800');
        feedbackEl.innerHTML = `<strong>Răspuns incorect!</strong> Varianta corectă era cea evidențiată cu verde. <br><span class="text-gray-600 mt-1 block">${qData.explanation}</span>`;
    }
}

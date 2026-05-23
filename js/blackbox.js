export default function initBlackbox(data) {
    document.getElementById('bb-title').textContent = data.title;
    
    const descEl = document.getElementById('bb-desc');
    descEl.innerHTML = `Aceste tehnici au fost abordate în cadrul cursului de <a href="${data.courseLink}" target="_blank" class="text-indigo-600 underline font-semibold hover:text-indigo-800">Testare Funcțională</a>. <a href="${data.courseLink}" target="_blank" class="text-indigo-600 font-bold hover:text-indigo-800 underline">Accesează cursul aici</a> pentru a vedea detaliile. Acum le aplicăm și în testarea non-funcțională pentru a asigura robustețea sistemului.`;
    
    const gridEl = document.getElementById('bb-grid');
    gridEl.innerHTML = data.items.map(item => `
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-all">
            <h3 class="text-xl font-bold text-indigo-800 mb-2">${item.icon} ${item.title}</h3>
            <p class="text-sm text-gray-600 mb-4">${item.description}</p>
            <div class="bg-indigo-50 p-3 rounded text-xs text-indigo-800 mb-2">
                <strong>Tehnica:</strong> ${item.technique}
            </div>
            <div class="bg-indigo-100 p-3 rounded text-xs text-indigo-900">
                <strong>Exemplu:</strong> ${item.example}
            </div>
        </div>
    `).join('');
}

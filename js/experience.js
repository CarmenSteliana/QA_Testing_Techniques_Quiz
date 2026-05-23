export default function initExperience(data) {
    document.getElementById('exp-title').textContent = data.title;
    
    const gridEl = document.getElementById('exp-grid');
    gridEl.innerHTML = data.items.map(item => `
        <div class="bg-white p-6 rounded-xl shadow-sm border border-amber-200">
            <h3 class="text-lg font-bold text-amber-800 mb-2">${item.icon} ${item.title}</h3>
            <p class="text-sm text-gray-600 mb-4">${item.description}</p>
            <div class="bg-amber-50 p-3 rounded text-xs text-amber-900 mb-2"><strong>Când:</strong> ${item.when}</div>
            <div class="bg-amber-100 p-3 rounded text-xs text-amber-900"><strong>Exemplu:</strong> ${item.example}</div>
        </div>
    `).join('');
}

export default function initWhitebox(data) {
    document.getElementById('wb-title').textContent = data.title;
    
    const gridEl = document.getElementById('wb-grid');
    gridEl.innerHTML = data.items.map(item => `
        <div class="bg-white p-5 rounded-lg shadow-sm border border-emerald-200">
            <h3 class="font-bold text-emerald-800">${item.title}</h3>
            <p class="text-xs mb-2">${item.description}</p>
            <code class="block bg-gray-900 text-green-400 p-3 rounded text-sm">${item.code}</code>
            <p class="text-xs text-emerald-600 mt-2 font-semibold">${item.coverageRule}</p>
        </div>
    `).join('');
}

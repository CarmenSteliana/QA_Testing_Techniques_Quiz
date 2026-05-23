export default function initHome(data) {
    document.getElementById('home-title').textContent = data.title;
    document.getElementById('home-welcome').textContent = data.welcomeMessage;
    
    const container = document.getElementById('home-cards');
    container.innerHTML = data.cards.map(card => `
        <div class="bg-white p-6 rounded-xl shadow-md border-t-4 ${card.borderColor}">
            <h2 class="text-xl font-bold mb-2">${card.title}</h2>
            <p>${card.description}</p>
        </div>
    `).join('');
}

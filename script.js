// 1. USTAWIENIA GŁÓWNE
const myBTCAddress = "bc1qe25ang24lnk8herylzzhjvdzhkkefxs53ddggd";
const myEmail = "TWOJ_MAIL@GMAIL.COM"; // <-- ZMIEŃ NA SWÓJ ADRES E-MAIL
let userBalance = 0;

const engine = document.getElementById('game-engine-render');
const modal = document.getElementById('game-window');

// 2. SYSTEM SPRAWDZANIA WPŁAT (AUTOMAT BLOCKCHAIN)
async function checkDeposit() {
    const statusText = document.getElementById('status-text');
    if (statusText) statusText.innerText = "ŁĄCZENIE Z BLOCKCHAINEM...";

    try {
        // API Blockstream sprawdza stan portfela w czasie rzeczywistym
        const response = await fetch(`https://blockstream.info/api/address/${myBTCAddress}/utxo`);
        const data = await response.json();

        if (data.length > 0) {
            let totalSatoshi = data.reduce((sum, utxo) => sum + utxo.value, 0);
            userBalance = totalSatoshi / 100000000; // Konwersja na BTC
            alert("ZNALEZIONO ŚRODKI! Twoje saldo: " + userBalance.toFixed(6) + " BTC");
            updateUI();
        } else {
            alert("Brak nowych wpłat. Upewnij się, że transakcja została wysłana.");
        }
    } catch (e) {
        alert("Błąd połączenia z siecią Bitcoin. Spróbuj za chwilę.");
    }
}

function updateUI() {
    const balDisplay = document.getElementById('balance-display');
    if (balDisplay) balDisplay.innerText = `SALDO: ${userBalance.toFixed(6)} BTC`;
}

// 3. NAWIGACJA PO GRACH
function openGame(gameType) {
    modal.style.display = "block";
    if (gameType === 'deposit') loadDeposit();
    else if (gameType === 'roulette') loadRoulette();
    else if (gameType === 'bj') loadBlackjack();
    else if (gameType === 'poker') loadPoker();
    else if (gameType === 'slot') loadSlots();
    else if (gameType === 'withdraw') loadWithdraw();
}

function closeGame() {
    modal.style.display = "none";
}

// --- MODUŁ WPŁAT (DOWOLNY PORTFEL) ---
function loadDeposit() {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${myBTCAddress}`;
    engine.innerHTML = `
        <div class="deposit-panel" style="text-align:center;">
            <h3>DOŁADUJ KONTO BTC</h3>
            <img src="${qrCodeUrl}" alt="QR Code" style="border:10px solid white; border-radius:10px; margin:15px;">
            <p style="font-size: 0.7rem; word-break: break-all;">ADRES: <strong>${myBTCAddress}</strong></p>
            <button onclick="checkDeposit()" class="gold-btn" style="background:#28a745; color:white; padding:10px; width:100%; cursor:pointer; border:none; border-radius:5px;">
                ✅ SPRAWDŹ CZY WPŁACONO
            </button>
        </div>`;
}

// --- GRA: RULETKA ---
function loadRoulette() {
    engine.innerHTML = `
        <div class="casino-machine" style="text-align:center;">
            <h3>RULETKA LIVE</h3>
            <div id="balance-display" style="color:gold; font-weight:bold;">SALDO: ${userBalance.toFixed(6)} BTC</div>
            <div id="wheel-display" style="font-size: 60px; margin: 20px;">0</div>
            <div id="status-text">Postaw 0.0001 BTC na kolor</div>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top:15px;">
                <button onclick="playRoulette('RED')" style="background:red; color:white; padding:15px; border-radius:5px; border:none; cursor:pointer;">CZERWONE</button>
                <button onclick="playRoulette('BLACK')" style="background:black; color:white; padding:15px; border-radius:5px; border:none; cursor:pointer;">CZARNE</button>
            </div>
        </div>`;
}

function playRoulette(betColor) {
    if (userBalance < 0.0001) { alert("Brak BTC!"); return; }
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
            const result = Math.

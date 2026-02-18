// ==========================================
// 1. KONFIGURACJA I ZMIENNE
// ==========================================
const myBTCAddress = "bc1qe25ang24lnk8herylzzhjvdzhkkefxs53ddggd";
let userBalance = 0;

const engine = document.getElementById('game-engine-render');
const modal = document.getElementById('game-window');

// ==========================================
// 2. NAWIGACJA (OTWIERANIE/ZAMYKANIE)
// ==========================================
function openGame(gameType) {
    if (!modal || !engine) return;
    
    modal.style.display = "block";
    engine.innerHTML = ""; // Czyścimy okno przed załadowaniem

    switch(gameType) {
        case 'deposit': loadDeposit(); break;
        case 'roulette': loadRoulette(); break;
        case 'slot': loadSlots(); break;
        case 'bj':
        case 'poker':
            engine.innerHTML = `<div style="text-align:center; padding:20px;"><h2>🃏 Gra wkrótce...</h2><p>Pracujemy nad tym!</p></div>`;
            break;
        default:
            engine.innerHTML = "<h3>GRA W BUDOWIE...</h3><p>Wróć wkrótce!</p>";
    }
}

function closeGame() {
    modal.style.display = "none";
    engine.innerHTML = "";
}

function updateUI() {
    const balDisplay = document.getElementById('balance-display');
    if (balDisplay) {
        balDisplay.innerText = `SALDO: ${userBalance.toFixed(6)} BTC`;
    }
}

// ==========================================
// 3. SYSTEM WPŁAT (BLOCKCHAIN)
// ==========================================
function loadDeposit() {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${myBTCAddress}`;
    engine.innerHTML = `
        <div class="deposit-panel" style="text-align:center;">
            <h2 style="color:#00f2ff;">WPŁAĆ BITCOIN</h2>
            <img src="${qrCodeUrl}" alt="QR" style="border:10px solid white; border-radius:10px; margin:15px;">
            <p style="font-size: 0.8rem;">ADRES: <br><strong style="color:gold; word-break:break-all;">${myBTCAddress}</strong></p>
            <button onclick="checkDeposit()" class="play-btn" style="background:#28a745; color:white; padding:12px; width:100%; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">
                ✅ SPRAWDŹ TRANSAKCJĘ
            </button>
        </div>`;
}

async function checkDeposit() {
    try {
        const response = await fetch(`https://blockstream.info/api/address/${myBTCAddress}/utxo`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            let totalSatoshi = data.reduce((sum, utxo) => sum + utxo.value, 0);
            userBalance = totalSatoshi / 100000000;
            alert("DOŁADOWANO! Twoje saldo to: " + userBalance.toFixed(6) + " BTC");
            updateUI();
        } else {
            alert("Brak nowych wpłat. Upewnij się

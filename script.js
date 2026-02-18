// 1. USTAWIENIA
const myBTCAddress = "bc1qe25ang24lnk8herylzzhjvdzhkkefxs53ddggd";
let userBalance = 0;

const engine = document.getElementById('game-engine-render');
const modal = document.getElementById('game-window');

// 2. FUNKCJE OTWIERANIA (NAPRAWIONE)
function openGame(gameType) {
    modal.style.display = "block"; // To sprawia, że okno się pojawia
    
    if (gameType === 'deposit') {
        loadDeposit();
    } else if (gameType === 'roulette') {
        loadRoulette();
    } else if (gameType === 'slot') {
        loadSlots();
    } else {
        engine.innerHTML = "<h3>GRA W BUDOWIE...</h3><p>Wróć wkrótce!</p>";
    }
}

function closeGame() {
    modal.style.display = "none";
    engine.innerHTML = "";
}

// 3. PANEL WPŁAT
function loadDeposit() {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${myBTCAddress}`;
    engine.innerHTML = `
        <div class="deposit-panel">
            <h2 style="color:#00f2ff;">WPŁAĆ KRYPTO</h2>
            <img src="${qrCodeUrl}" alt="QR Code">
            <p style="font-size: 0.7rem; color: #fff;">ADRES PORTFELA:</p>
            <p style="font-size: 0.8rem; word-break: break-all; color: gold;">${myBTCAddress}</p>
            <button onclick="checkDeposit()" class="play-btn" style="background:#28a745; color:white;">SPRAWDŹ TRANSAKCJĘ</button>
        </div>`;
}

// 4. SPRAWDZANIE BLOCKCHAINA
async function checkDeposit() {
    try {
        const response = await fetch(`https://blockstream.info/api/address/${myBTCAddress}/utxo`);
        const data = await response.json();
        if (data.length > 0) {
            let totalSatoshi = data.reduce((sum, utxo) => sum + utxo.value, 0);
            userBalance = totalSatoshi / 100000000;
            alert("WPŁATA WYKRYTA! Saldo: " + userBalance.toFixed(6) + " BTC");
        } else {
            alert("Brak nowych wpłat. Spróbuj za chwilę.");
        }
    } catch (e) {
        alert("Błąd sieci. Sprawdź połączenie.");
    }
}

// --- LOGIKA GIER (Uproszczona) ---
function loadRoulette() {
    engine.innerHTML = `<h3>🎡 RULETKA NANO</h3><p>Saldo: ${userBalance.toFixed(6)} BTC</p><button class="play-btn" onclick="alert('Kręcenie...')">STAWIAJ</button>`;
}

function loadSlots() {
    engine.innerHTML = `<h3>🎰 777 SLOTS</h3><p>Saldo: ${userBalance.toFixed(6)} BTC</p><button class="play-btn" onclick="alert('Losowanie...')">SPIN</button>`;
}

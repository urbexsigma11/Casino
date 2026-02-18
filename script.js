const myBTCAddress = "bc1qe25ang24lnk8herylzzhjvdzhkkefxs53ddggd";
let userBalance = 0;

const engine = document.getElementById('game-engine-render');
const modal = document.getElementById('game-window');

function updateUI() {
    const balDisplay = document.getElementById('balance-display');
    if (balDisplay) balDisplay.innerText = `SALDO: ${userBalance.toFixed(6)} BTC`;
}

function openGame(gameType) {
    modal.style.display = "block";
    engine.innerHTML = "";

    if (gameType === 'deposit') loadDeposit();
    else if (gameType === 'roulette') loadRoulette();
    else if (gameType === 'slot') loadSlots();
    else engine.innerHTML = "<h2>GRA W BUDOWIE</h2><p>Zapraszamy wkrótce!</p>";
}

function closeGame() {
    modal.style.display = "none";
}

function loadDeposit() {
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${myBTCAddress}`;
    engine.innerHTML = `
        <h2 style="color:#00f2ff;">WPŁAĆ BTC</h2>
        <img src="${qr}" style="border:10px solid white; border-radius:10px; margin:15px;">
        <p style="font-size:0.8rem; word-break:break-all; color:gold;">${myBTCAddress}</p>
        <button onclick="checkDeposit()" class="play-btn" style="background:#28a745; color:white;">SPRAWDŹ WPŁATĘ</button>
    `;
}

async function checkDeposit() {
    try {
        const response = await fetch(`https://blockstream.info/api/address/${myBTCAddress}/utxo`);
        const data = await response.json();
        if (data && data.length > 0) {
            userBalance = data.reduce((sum, utxo) => sum + utxo.value, 0) / 100000000;
            updateUI();
            alert("DOŁADOWANO: " + userBalance + " BTC");
        } else alert("Brak wpłat.");
    } catch (e) { alert("Błąd sieci."); }
}

function loadSlots() {
    engine.innerHTML = `
        <h2 style="color:#00f2ff;">🎰 NANO SLOTS</h2>
        <div id="slot-res" style="font-size:40px; margin:20px; background:#000; padding:20px; border:1px solid gold;">🍒|🍋|🔔</div>
        <button class="play-btn" onclick="playSlots()">SPIN (0.0001 BTC)</button>
    `;
}

function playSlots() {
    if (userBalance < 0.0001) return alert("Brak środków!");
    userBalance -= 0.0001; updateUI();
    const s = ['🍒','🍋','🔔','💎','7️⃣'];
    const res = document.getElementById('slot-res');
    let c = 0;
    const i = setInterval(() => {
        res.innerText = `${s[Math.floor(Math.random()*5)]}|${s[Math.floor(Math.random()*5)]}|${s[Math.floor(Math.random()*5)]}`;
        if (++c > 15) {
            clearInterval(i);
            const f = res.innerText.split('|');
            if (f[0]===f[1] && f[1]===f[2]) { userBalance += 0.001; alert("JACKPOT!"); }
            updateUI();
        }
    }, 100);
}

function loadRoulette() {
    engine.innerHTML = `
        <h2 style="color:#00f2ff;">🎡 RULETKA</h2>
        <div id="wheel" style="font-size:60px; margin:20px;">0</div>
        <button onclick="playRoulette('RED')" style="background:red; color:white; padding:10px; margin:5px; border:none; cursor:pointer;">CZERWONE</button>
        <button onclick="playRoulette('BLACK')" style="background:black; color:white; padding:10px; margin:5px; border:1px solid white; cursor:pointer;">CZARNE</button>
    `;
}

function playRoulette(col) {
    if (userBalance < 0.0001) return alert("Brak BTC!");
    userBalance -= 0.0001; updateUI();
    const wheel = document.getElementById('wheel');
    let c = 0;
    const i = setInterval(() => {
        const n = Math.floor(Math.random()*37);
        wheel.innerText = n;
        if (++c > 20) {
            clearInterval(i);
            const win = n===0 ? "GREEN" : (n%2===0 ? "RED" : "BLACK");
            if (col === win) { userBalance += 0.0002; alert("WYGRANA!"); }
            updateUI();
        }
    }, 100);
}

const display = document.getElementById('result-display');
const status = document.getElementById('status-overlay');
const btn = document.getElementById('spinBtn');

btn.addEventListener('click', () => {
    btn.disabled = true;
    status.innerText = "TRWA LOSOWANIE...";
    display.style.opacity = "0.3";
    
    let timer = 0;
    const interval = setInterval(() => {
        display.innerText = Math.floor(Math.random() * 36);
        timer++;
        
        if (timer > 30) {
            clearInterval(interval);
            const finalResult = Math.floor(Math.random() * 36);
            display.innerText = finalResult;
            display.style.opacity = "1";
            status.innerText = "KONIEC ROZDANIA - WYGRANA: " + finalResult;
            btn.disabled = false;
        }
    }, 100);
});

function placeBet(type) {
    alert("Postawiono zakład na: " + type);
}

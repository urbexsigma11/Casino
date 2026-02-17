const display = document.getElementById('display');
const btn = document.getElementById('spinBtn');
const options = ["ACCESS GRANTED", "ACCESS DENIED", "SYSTEM ERROR", "REBOOTING", "CRITICAL HIT"];

btn.addEventListener('click', () => {
    btn.disabled = true;
    let counter = 0;
    
    const interval = setInterval(() => {
        display.innerText = options[Math.floor(Math.random() * options.length)];
        counter++;
        
        if (counter > 20) {
            clearInterval(interval);
            const final = options[Math.floor(Math.random() * options.length)];
            display.innerText = ">>> " + final + " <<<";
            btn.disabled = false;
        }
    }, 50);
});
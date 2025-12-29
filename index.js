let timeLeft = 300;
let timerInterval = null;
let beepInterval = null;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Generates a clean beep sound
function playBeep(frequency, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function updateDisplay() {
    document.getElementById('timer').innerText = timeLeft;
    const cyclePos = (300 - timeLeft) % 30;
    const isRest = cyclePos >= 20;
    const status = document.getElementById('status');

    if (timeLeft <= 0) {
        status.innerText = "DONE!";
        status.style.color = "#4CAF50";
    } else {
        status.innerText = isRest ? "REST" : "JUMP!";
        status.style.color = isRest ? "#FF9800" : "#4CAF50";
    }
}

function startTimer() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    toggleUI('running');

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            handleBeeps();
        } else {
            finish();
        }
    }, 1000);

    handleBeeps(); // Initial check
}

function handleBeeps() {
    clearInterval(beepInterval);
    const cyclePos = (300 - timeLeft) % 30;

    // Only beep during the first 20s of the 30s cycle
    if (cyclePos < 20 && timeLeft > 0) {
        // Play 3 times per second
        beepInterval = setInterval(() => playBeep(880, 0.1), 333);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    clearInterval(beepInterval);
    toggleUI('paused');
}

function resetTimer() {
    clearInterval(timerInterval);
    clearInterval(beepInterval);
    timeLeft = 300;
    updateDisplay();
    document.getElementById('status').innerText = "Ready?";
    toggleUI('idle');
}

function finish() {
    clearInterval(timerInterval);
    clearInterval(beepInterval);
    playBeep(440, 1.5); // Long final beep
    toggleUI('idle');
}

function toggleUI(state) {
    document.getElementById('ui-idle').classList.toggle('hidden', state !== 'idle');
    document.getElementById('ui-running').classList.toggle('hidden', state !== 'running');
    document.getElementById('ui-paused').classList.toggle('hidden', state !== 'paused');
}
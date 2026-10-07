let targetText = "";
let testRunning = false;
let timerStarted = false;
let startTime = 0;
let timerInterval = null;

// Elements
const paragraphInput = document.getElementById("paragraphInput");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const testArea = document.getElementById("testArea");
const displayText = document.getElementById("displayText");
const typingBox = document.getElementById("typingBox");
const completeBtn = document.getElementById("completeBtn");

const timer = document.getElementById("timer");
const speed = document.getElementById("speed");
const accuracy = document.getElementById("accuracy");
const mistakes = document.getElementById("mistakes");
const cpm = document.getElementById("cpm");

const resultBox = document.getElementById("resultBox");
const resultTime = document.getElementById("resultTime");
const resultSpeed = document.getElementById("resultSpeed");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultMistakes = document.getElementById("resultMistakes");

const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");

// Start Test: initialize with paragraph text
startBtn.addEventListener("click", startTest);
function startTest() {
    targetText = paragraphInput.value.replace(/\r\n/g, "\n");
    if (!targetText) {
        alert("Please enter a paragraph first.");
        return;
    }
    // Prepare UI
    paragraphInput.disabled = true;
    testArea.classList.remove("hidden");
    resultBox.classList.add("hidden");

    // Reset stats
    clearInterval(timerInterval);
    testRunning = true;
    timerStarted = false;
    timer.textContent = "0.0";
    speed.textContent = "0";
    accuracy.textContent = "100";
    mistakes.textContent = "0";
    cpm.textContent = "0";

    // Reset typing area
    typingBox.value = "";
    typingBox.disabled = false;
    typingBox.maxLength = targetText.length;
    typingBox.focus();
    completeBtn.disabled = false;

    displayText.innerHTML = "";
    // Render the paragraph (no chars typed yet)
    renderText("");
}

// Handle typing input
typingBox.addEventListener("input", () => {
    if (!testRunning) return;
    const typedText = typingBox.value;

    // Start timer on first keystroke
    if (!timerStarted && typedText.length > 0) {
        timerStarted = true;
        startTime = performance.now();
        timerInterval = setInterval(updateLiveStats, 100);
    }

    // Update paragraph highlighting and stats
    renderText(typedText);
    updateLiveStats();
});

// Complete Test button handler
completeBtn.addEventListener("click", () => {
    if (!testRunning) return;
    updateLiveStats();  // ensure stats are up-to-date
    finishTest();
});

// Render paragraph text with highlights
function renderText(typed) {
    displayText.innerHTML = "";
    for (let i = 0; i < targetText.length; i++) {
        const span = document.createElement("span");
        span.textContent = targetText[i];
        if (i < typed.length) {
            span.classList.add(typed[i] === targetText[i] ? "correct" : "incorrect");
        }
        if (i === typed.length) {
            span.classList.add("current");
        }
        displayText.appendChild(span);
    }
}

// Update live stats (time, WPM, accuracy, mistakes, CPM)
function updateLiveStats() {
    if (!timerStarted) return;
    const elapsedSec = (performance.now() - startTime) / 1000;
    const minutes = elapsedSec / 60;
    const typedText = typingBox.value;

    // Count correct characters and mistakes
    let correct = 0, errorCount = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === targetText[i]) correct++;
        else errorCount++;
    }

    // Accuracy
    let acc = typedText.length > 0 ? (correct / typedText.length) * 100 : 100;
    accuracy.textContent = Math.round(acc);

    // WPM (words per minute; 5 chars = 1 word)
    let wpm = minutes > 0 ? (correct / 5) / minutes : 0;
    speed.textContent = Math.round(wpm);

    // CPM (characters per minute, all typed)
    let currentCPM = minutes > 0 ? (typedText.length / minutes) : 0;
    cpm.textContent = Math.round(currentCPM);

    // Timer and mistakes
    timer.textContent = elapsedSec.toFixed(1);
    mistakes.textContent = errorCount;
}

// Finish the test: stop timer, show results, save history
function finishTest() {
    testRunning = false;
    clearInterval(timerInterval);

    typingBox.disabled = true;
    completeBtn.disabled = true;

    // Populate result panel
    resultTime.textContent = timer.textContent;
    resultSpeed.textContent = speed.textContent;
    resultAccuracy.textContent = accuracy.textContent;
    resultMistakes.textContent = mistakes.textContent;
    resultBox.classList.remove("hidden");

    // Save to history (keep last 5)
    let history = JSON.parse(localStorage.getItem("typingHistory") || "[]");
    history.unshift({
        time: resultTime.textContent,
        wpm: resultSpeed.textContent,
        acc: resultAccuracy.textContent,
        mistakes: resultMistakes.textContent
    });
    if (history.length > 5) history.pop();
    localStorage.setItem("typingHistory", JSON.stringify(history));

    updateHistoryUI();
}

// Update history display
function updateHistoryUI() {
    let history = JSON.parse(localStorage.getItem("typingHistory") || "[]");
    if (history.length === 0) {
        historyBox.classList.add("hidden");
        return;
    }
    historyBox.classList.remove("hidden");
    historyList.innerHTML = "";
    history.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `Time: ${entry.time}s, WPM: ${entry.wpm}, Accuracy: ${entry.acc}%, Mistakes: ${entry.mistakes}`;
        historyList.appendChild(li);
    });
}

// Retry button: restart test on same text
retryBtn.addEventListener("click", () => {
    resultBox.classList.add("hidden");
    paragraphInput.disabled = false;
    startTest();
});

// Disallow pasting in typing box (to prevent cheating)
typingBox.addEventListener("paste", (e) => {
    e.preventDefault();
});

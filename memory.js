// "Pictures" for the memory game (swap for <img> tags/paths if you'd rather use real photos)
const EMOJIS = ["🦁", "🐘", "🦒", "🦓", "🐒", "🐼", "🐧", "🐯", "🦊", "🐺", "🐨", "🐹"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let score = 0;
let matches = 0;
let timeLeft = 0;
let timer;

const board = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

const difficulty = document.getElementById("difficulty");
const pairs = document.getElementById("pairs");
const startBtn = document.getElementById("startBtn");

const leaderboard = document.getElementById("leaderboard");

// Start a new game
function startGame() {

    clearInterval(timer);
    board.innerHTML = "";

    cards = [];
    firstCard = null;
    secondCard = null;
    lockBoard = true; // locked until the memorization window ends

    score = 0;
    matches = 0;

    scoreDisplay.textContent = "Score: " + score;

    let pairCount = Number(pairs.value);
    if (pairCount === 8) {
        timeLeft = 120;
    } else if (pairCount === 10) {
        timeLeft = 150;
    } else {
        timeLeft = 180;
    }
    timerDisplay.textContent = "Time: " + timeLeft;
    createCards(pairCount);

    setTimeout(function () {
        hideCards();
        lockBoard = false;
    }, Number(difficulty.value) * 1000);

    timer = setInterval(updateTimer, 1000);
}

// Create the cards
function createCards(pairCount) {
    let values = [];
    for (let i = 1; i <= pairCount; i++) {
        values.push(i);
        values.push(i);

    }

    shuffle(values);

    values.forEach(function (value) {
        let card = document.createElement("div");
        card.className = "card revealed";
        card.dataset.value = value;
        card.textContent = EMOJIS[value - 1];
        card.addEventListener("click", flipCard);
        board.appendChild(card);
        cards.push(card);
    });

}

// Shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

}

// Hide every card (flip face-down to its position number)
function hideCards() {
    cards.forEach(function (card, index) {
        if (!card.classList.contains("matched")) {
            card.textContent = index + 1;
            card.classList.remove("revealed");
        }
    });

}

// Flip a card
function flipCard() {

    if (lockBoard) {
        return;
    }

    if (this === firstCard) {
        return;
    }

    if (this.classList.contains("matched")) {
        return;
    }

    this.textContent = EMOJIS[this.dataset.value - 1];
    this.classList.add("revealed");

    if (firstCard === null) {
        firstCard = this;
        return;

    }
    secondCard = this;
    lockBoard = true;
    checkMatch();

}

// Check if the cards match
function checkMatch() {

    if (firstCard.dataset.value === secondCard.dataset.value) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        score += 10;
        matches++;

        scoreDisplay.textContent = "Score: " + score;

        resetTurn();

        let totalPairs = Number(pairs.value);

        if (matches === totalPairs) {
            clearInterval(timer);
            setTimeout(function () {
                alert("You matched every pair!");
                saveScore();
            }, 300);
        }
    } else {

        score -= 5;

        scoreDisplay.textContent = "Score: " + score;

        setTimeout(function () {
            firstCard.textContent =
                cards.indexOf(firstCard) + 1;
            firstCard.classList.remove("revealed");

            secondCard.textContent =
                cards.indexOf(secondCard) + 1;
            secondCard.classList.remove("revealed");
            resetTurn();
        }, 800);
    }
}

// Reset for the next turn
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;

}

// Update the timer every second
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = "Time: " + timeLeft;

    // -1 point per second, per the assignment's scoring rules
    score -= 1;
    scoreDisplay.textContent = "Score: " + score;

    if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Time is up!");
        saveScore();

    }

}
// Save the player's score
function saveScore() {
    let player = prompt("Enter your name:");

    if (player === null || player.trim() === "") {
        player = "Player";
    }

    let scores =
        JSON.parse(localStorage.getItem("memoryLeaderboard")) || [];

    scores.push({
        name: player,
        score: score
    });

    scores.sort(function (a, b) {
        return b.score - a.score;
    });

    scores = scores.slice(0, 5);

    localStorage.setItem(
        "memoryLeaderboard",
        JSON.stringify(scores)
    );

    loadLeaderboard();

}

// Display the leaderboard
function loadLeaderboard() {
    leaderboard.innerHTML = "";

    let scores =
        JSON.parse(localStorage.getItem("memoryLeaderboard")) || [];

    scores.forEach(function (player) {
        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        let scoreCell = document.createElement("td");

        nameCell.textContent = player.name;
        scoreCell.textContent = player.score;

        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        leaderboard.appendChild(row);
    });

}

startBtn.addEventListener("click", startGame);
loadLeaderboard();
let secretNumber;
let guessesLeft;
let wins = 0;
let rounds = 0;

const maxGuesses = 10;

// Get elements from the page
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const newGameBtn = document.getElementById("newGameBtn");

const message = document.getElementById("message");
const guessesDisplay = document.getElementById("guessesLeft");
const winsDisplay = document.getElementById("wins");
const roundsDisplay = document.getElementById("rounds");
const clock = document.getElementById("clock");

const soundToggle = document.getElementById("soundToggle");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");

function playSound(sound){
    if(soundToggle.checked){
        sound.currentTime = 0;
        sound.play();
    }
}

// Start a new round
function startGame(){
    secretNumber = Math.floor(Math.random() * 100) + 1;
    guessesLeft = maxGuesses;
    rounds++;

    guessesDisplay.textContent = guessesLeft;
    roundsDisplay.textContent = rounds;

    message.textContent = "Take a guess to begin.";

    guessInput.value = "";
    guessInput.focus();
}

// Check the player's guess
function checkGuess(){

    let guess = Number(guessInput.value);

    // Make sure the input is valid
    if(isNaN(guess) || guess < 1 || guess > 100){
        message.textContent = "Enter a number from 1 to 100.";
        return;
    }

    guessesLeft--;
    guessesDisplay.textContent = guessesLeft;

    if(guess === secretNumber){

        message.textContent = "Correct! Starting a new game.";
        wins++;
        winsDisplay.textContent = wins;

        playSound(correctSound);
        playSound(winSound);

        setTimeout(startGame,1500);
        return;
    }

    playSound(wrongSound);
    message.textContent = guess < secretNumber ? "Too low." : "Too high.";

    // Start over if there are no guesses left
    if(guessesLeft === 0){
        message.textContent =
            "Out of guesses! The number was " +
            secretNumber +
            ". Starting a new game.";

        setTimeout(startGame,2000);
    }

    guessInput.value = "";
    guessInput.focus();
}

// Update the digital clock
function updateClock(){

    let now = new Date();
    clock.textContent = now.toLocaleTimeString();

}

guessBtn.addEventListener("click", checkGuess);
newGameBtn.addEventListener("click", startGame);

guessInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        checkGuess();
    }

});

setInterval(updateClock,1000);

updateClock();
startGame();
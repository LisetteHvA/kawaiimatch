/**
 * NAME:        KAWAII MATCH
 * AUTHOR:      Lisette Pool
 * DESCRIPTION: Search the matching item and click it to gain points.
 *              If you have 5 stars, you can go to the next round.
 *              When a user clicks a wrong item, its game over, 
 *              unles you have a star, then you lose it.
 */
// ---------------------- LEVEL DATA --------------------------

const levelData = [
    {time: 30, numberOfItems: 6},
    {time: 20, numberOfItems: 6},
    {time: 15, numberOfItems: 6},
    {time: 30, numberOfItems: 9},
    {time: 20, numberOfItems: 9},
    {time: 15, numberOfItems: 9},
    {time: 30, numberOfItems: 12},
    {time: 20, numberOfItems: 12},
    {time: 15, numberOfItems: 12},
    {time: 30, numberOfItems: 15},
    {time: 20, numberOfItems: 15},
    {time: 15, numberOfItems: 15},
];

// ---------------------- AUDIO FILES --------------------------

const audioFiles = {
    background: new Audio("sounds/background.mp3"),
    hover: new Audio("sounds/hover.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    incorrect: new Audio("sounds/incorrect.mp3"),
    nextlevel: new Audio("sounds/winner.mp3"),
    gameover: new Audio("sounds/gameover.mp3"),
    outoftime: new Audio("sounds/outoftime.mp3"),
};

// ---------------------- DOM ELEMENTS --------------------------

const
    metricsContainer = document.getElementById("metricsContainer"),
    starsContainer = document.getElementById("starsContainer"),
    levelContainer = document.getElementById("levelContainer"),
    timerContainer = document.getElementById("timerContainer"),
    gameContainer = document.getElementById("gameContainer"),
    lifesContainer = document.getElementById("lifesContainer"),
    pauseButton = document.getElementById("pauseButton");

// ---------------------- IMAGES -------------------------- 

// Number of images within images folder to show as item
// P54 - https://www.freepik.com/author/freepik/icons/kawaii-lineal-color_47?t=f&sign-up=google&page=40#uuid=f3bfb0bd-e723-4676-b6ae-1c1daa026382
const numberOfGameImages = 200;

// ---------------------- GAME SETTINGS -------------------------- 
// CONSTANTS
const requiredStarsForLevelUp = 5;
const numberOfLevels = levelData.length;

// VARIABLES

// Level info
let level = 1;
let numberOfItemsPerLevel;
let matchingItem;
let itemsListA = [];
let itemsListB = [];

// Time
let timePerLevel;
let endTime;
let remainingTime = 0;
let timerInterval;
let startPauseTime;
let timerPaused = false;
let totalPauseTime = 0;

// Game metrics
let stars = 0;
let lifes = 3;

// ---------------------- INFO SCREEN DATA --------------------------

let infoScreen = {
    start: {
        image: "start.gif",
        buttonText: "Start game!",
        action: "loadLevel();",
        audio: "",
    },
    nextLevel: {
        image: "nextlevel.gif",
        buttonText: "Play next level",
        action: "loadLevel(false);",
        audio: "sounds/correct.mp3",
    },
    lostLife: {
        image: "lostlife1.gif",
        buttonText: "Retry this level!",
        action: "setGame(false);",
        audio: "sounds/gameover.mp3",
    },
    outOfTime: {
        image: "outoftime.gif",
        buttonText: "Retry this level!",
        action: "setGame(false);",
        audio: "sounds/outoftime.mp3",
    },
    gameOver: {
        image: "gameover.gif",
        buttonText: "Restart game!",
        action: "location.reload();",
        audio: "sounds/gameover.mp3",
    },
    winner: {
        image: "winner.gif",
        buttonText: "Restart game!",
        action: "location.reload();",
        audio: "sounds/winner.mp3",
    },
};

// ---------------------- BEFORE PLAYING --------------------------
window.onload = function() {
    startGame();
}

// Shows screen for the game
function startGame() {
    showInfoScreen("start");
}

// ---------------------- LOAD LEVEL --------------------------

// Load the level if it exists
function loadLevel(level) {
    try {
        // Check if the level is within the range of available levels
        if (level < numberOfLevels) {
            throw new Error('Level ' + level + ' does not exist. Please choose a level within the available range.');
        }
        // Load the game environment for the specified level
        setGame();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ---------------------- SET GAME UP --------------------------

// Sets up the game environment for a level;
function setGame(resetState) {
    audioFiles.background.play();
    clearElement(gameContainer);
    if (resetState) {
        resetGameState(); // Reset game state only if specified
    }
    getLevelData(level);
    chooseItems();
    createGameBoards();
    startTimer(timePerLevel);
    showElement(metricsContainer, true);
    showGameMetrics();
}

// Retrieves data for the specified level from the levelData array.
function getLevelData() {
    const data = levelData[level - 1];
    timePerLevel = data.time;
    numberOfItemsPerLevel = data.numberOfItems;
}

//Chooses items for the game.
function chooseItems() {
    matchingItem = pickMatchingItem();
    itemsListA = createItemsList();
    itemsListB = createItemsList();
}

//Creates game boards based on the selected items.
function createGameBoards() {
    createBoard("board1");
    createBoard("board2");
    createItemImages(itemsListA, "board1");
    createItemImages(itemsListB, "board2");
}

// Creates an empty board element with a specified ID 
function createBoard(boardId) {
    let board = document.createElement("div");
    board.id = boardId;
    board.classList.add("board");
    gameContainer.appendChild(board);
}

//Selects a random the item that is the match for the round
function pickMatchingItem() {
    return Math.floor(Math.random() * numberOfGameImages);
}

//Generates a list of unique item numbers for the game, including the matching item.
function createItemsList() {
    let numbers = [];
    while (numbers.length < numberOfItemsPerLevel - 1) {
        const randomNumber = Math.floor(Math.random() * numberOfGameImages);
        if (!numbers.includes(randomNumber) 
            && randomNumber != matchingItem
            && !itemsListA.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    // Add number of the matchingItem on random position in the list
    let randomIndex = Math.floor(Math.random() * numberOfItemsPerLevel - 1);
    numbers.splice(randomIndex, 0, matchingItem);

    return numbers;
}

// Adds icons for all chosen items to the specified board.
function createItemImages(itemNumbers, boardId) {
    const board = document.getElementById(boardId);
    for (const itemNumber of itemNumbers) {
        const itemImg = new Image();
        itemImg.src = `images/item-images/${itemNumber}.png`;
        itemImg.alt = itemNumber;
        itemImg.addEventListener("click", checkSelectedItem);
        itemImg.addEventListener("mouseover", () => audioFiles.hover.play());
        board.appendChild(itemImg);
    }
}

// ---------------------- DURING PLAYING --------------------------

// ---------------------- TIMER --------------------------

// Starts a timer for the specified duration in seconds.
function startTimer(duration) {
    let startTime = Date.now();
    endTime = startTime + (duration * 1000);
    remainingTime = duration;
    timerContainer.innerHTML = timePerLevel;

    timerInterval = setInterval(() => {
        if (!timerPaused) {
            remainingTime = Math.round((endTime - Date.now()) / 1000);
            remainingTime += totalPauseTime;
            if (remainingTime > 0) {
                timerContainer.innerHTML = remainingTime;
            } else {
                stopTimer();
                lostLife("outOfTime");
            }
        }
    }, 1000);
}

// Event listeners for the pause button
pauseButton.addEventListener("click", toggleTimerPause);
pauseButton.addEventListener("mouseover", () => audioFiles.hover.play());

// Pause timer toggle
function toggleTimerPause() {
    if (!timerPaused) {
        startPauseTime = Date.now();
    } else {
        endPauseTime = Date.now();
        totalPauseTime += Math.round((endPauseTime - startPauseTime) / 1000);
    }
    timerPaused = !timerPaused;
}

// Stops the timer interval
function stopTimer() {
    clearInterval(timerInterval);
    totalPauseTime = 0;
}

// ---------------------- CHECK THE SELECTED ITEM --------------------------

// Check if the selected item is te matching item
function checkSelectedItem() {
    stopTimer();
    if (this.alt == matchingItem) {
        handleCorrectChoice();
    } else {
        handleIncorrectChoice();
    }
}

// Handles if the correct item is selected
function handleCorrectChoice() {
    audioFiles.correct.play();
    earnStar();
    readyForNextLevel();
}

// Handles if the incorrect item is selected
function handleIncorrectChoice() {
    audioFiles.incorrect.play();
    lostLife("incorrectChoise");
}

// ---------------------- GAME METRICS --------------------------

//Shows the current amount of stars, time left, level & lifes
function showGameMetrics() {
    starsContainer.textContent = stars;
    lifesContainer.textContent = lifes;
    levelContainer.textContent = level;
}

// ---------------------- LEVEL UP --------------------------

function levelUp() {
    level++;
    levelUpButtonTextUpdate();
    showGameMetrics();
    showInfoScreen("nextLevel");
    addLifeCheck();
}

function levelUpButtonTextUpdate() {
    infoScreen.nextLevel.buttonText = "Play level " + (level) + "!";
}

// ---------------------- LIFES --------------------------

function lostLife(reason) {
    if (lifes > 0) {
        lifes--;
        showGameMetrics();
        if (lifes > 0) {
            switch (reason) {
                case "incorrectChoise":
                    lostLifeInfoScreenUpdate();
                    showInfoScreen("lostLife");
                    break;
                case "outOfTime":
                    showInfoScreen("outOfTime");
                    break;
            }
        } else {
            showInfoScreen("gameOver");
        }
    }
}

function lostLifeInfoScreenUpdate() {
    infoScreen.lostLife.image = "lostlife" + (lifes) + ".gif";
}

function addLifeCheck() {
    if (level % 3 === 0) {
        lifes++;
    }
    showGameMetrics();
}

// ---------------------- STARS --------------------------

function earnStar() {
    stars++;
    showGameMetrics();
}

// ---------------------- READY FOR NEXT LEVEL & GAME OVER CHECK --------------------------

function readyForNextLevel() {
    if (stars === requiredStarsForLevelUp) {
        levelUp();
    } else {
        setGame(level); // maybe this should go
    }
}

function resetGameState() {
    clearInterval(timerInterval);
    timerPaused = false;
    totalPauseTime = 0;
    //stars = 0;
    lifes = 3;
    remainingTime = 0;
}

// ---------------------- GENERAL --------------------------

// Show Element By ID --> Show: true/false
function showElement(element, show) {
    element.style.visibility = show ? "visible" : "hidden";
}

// Clears the content of an html element
function clearElement(element) {
    element.innerHTML = "";
}

// ---------------------- INFO SCREEN --------------------------

// show the information screen based on type
// options: start | nextLevel | lostLife | outOfTime | gameOver
// showInfoScreen(outOfTime);

function showInfoScreen(infoScreenType) {
    emptyForInfoScreen();
    let info = infoScreen[infoScreenType];
    createBoard("infoScreen");
    addInfoScreenAudio(info.audio);
    addInfoScreenImage(info.image);
    addInfoScreenButton(info.buttonText);
    addInfoScreenAction(info.action);
}

// Remove game board for the info screen
function emptyForInfoScreen() {
    showElement(metricsContainer, false);
    clearElement(gameContainer);
}

// Play audio at info screen
function addInfoScreenAudio(audio) {
    if (audio != "") {
        const audioElement = new Audio(audio);
        audioElement.play();
    }
}

// Add image to info screen
function addInfoScreenImage(image) {
    let imgElement = document.createElement("img");
    imgElement.src = "images/info-screen/"+ image;
    imgElement.id = "infoScreenImage";
    imgElement.addEventListener("mouseover", () =>{audioFiles.hover.play();});
    let infoScreen = document.getElementById("infoScreen");
    infoScreen.appendChild(imgElement);
}

// Add on click action to button and image on the info screen
function addInfoScreenAction(action) {
    let infoScreenImage = document.getElementById("infoScreen");
    let infoScreenButton = document.getElementById("infoScreenButton");
    infoScreenImage.addEventListener("click", () =>{eval(action)});
    infoScreenButton.addEventListener("click", () =>{eval(action)});
}

// Add button to info screen with button text
function addInfoScreenButton(buttonText) {
    let infoScreenButton = document.createElement("button");
    infoScreenButton.innerText = buttonText;
    let selectedBoard = document.getElementById("infoScreen");
    infoScreenButton.id = "infoScreenButton";
    selectedBoard.appendChild(infoScreenButton);
    infoScreenButton.addEventListener("mouseover", () =>{audioFiles.hover.play();});
}

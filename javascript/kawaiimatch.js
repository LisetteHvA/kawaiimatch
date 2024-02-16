/**
 * NAME:        KAWAII MATCH
 * AUTHOR:      Lisette Pool
 * DESCRIPTION: Search the matching item and click it to gain points.
 *              If you have 5 stars, you can go to the next round.
 *              When a user clicks a wrong item, its game over, 
 *              unles you have a star, then you lose it.
 */

// CONSTANTS
const levelData = [
    {time: 30, numberOfItems: 6},
    {time: 20, numberOfItems: 6},
    {time: 15, numberOfItems: 6},
    // level winnen
    {time: 30, numberOfItems: 9},
    {time: 20, numberOfItems: 9},
    {time: 15, numberOfItems: 9},
    // level winnen
    {time: 30, numberOfItems: 12},
    {time: 20, numberOfItems: 12},
    {time: 15, numberOfItems: 12},
    // level winnen
    {time: 30, numberOfItems: 15},
    {time: 20, numberOfItems: 15},
    {time: 15, numberOfItems: 15},
];

// AUDIO FILES
const audioFiles = {
    background: new Audio("sounds/background.mp3"),
    hover: new Audio("sounds/hover.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    incorrect: new Audio("sounds/incorrect.mp3"),
    winner: new Audio("sounds/winner.mp3"),
    loser: new Audio("sounds/loser.mp3"),
    slow: new Audio("sounds/slow.mp3"),
};

// DOM ELEMENTS
const
    metricsContainer = document.getElementById("metricsContainer"),
    starsContainer = document.getElementById("starsContainer"),
    levelContainer = document.getElementById("levelContainer"),
    timerContainer = document.getElementById("timerContainer"),
    gameContainer = document.getElementById("gameContainer"),
    lifesContainer = document.getElementById("lifesContainer"),

    // Number of images within images folder to show as item
    // P54 - https://www.freepik.com/author/freepik/icons/kawaii-lineal-color_47?t=f&sign-up=google&page=40#uuid=f3bfb0bd-e723-4676-b6ae-1c1daa026382
    numberOfGameImages = 105;

// VARIABLES
let matchingItem;
let itemsListA = [];
let itemsListB = [];
let timeLeft = 0;
let timerInterval;
let stars = 0;
let level = 1;
let timePerLevel;
let numberOfItemsPerLevel;
let backgroundImage;
let lifes = 3;

//////////////////// START GAME ///////////////////////
window.onload = function() {
    startGame();
}

/**
 * FUNCTION: START GAME
 * Creates the game boards
 */
function startGame() {
    showElement(metricsContainer, false);
    createBoard("startBoard");
    createBoardImage("start", "startBoard", "setGame");
    createNewButton("Play Game", "startBoard", "setGame");
}

//////////////////// SET GAME UP ///////////////////////
/**
 * Function: setGame()
 *
 * Description:
 * Sets up the game environment for a level;
 * 1. Plays the background audio.
 * 2. Clears the content of the game container.
 * 3. Retrieves level data based on the current level.
 * 4. Chooses items for the game.
 * 5. Creates game boards based on the selected items.
 * 6. Starts the timer with the time limit for the current level.
 * 7. Shows the metrics container.
 * 8. Displays game metrics.
 */
function setGame() {
    audioFiles.background.play();
    clearElement(gameContainer);
    getLevelData(level);
    chooseItems();
    createGameBoards();
    startTimer(timePerLevel);
    showElement(metricsContainer, true);
    showGameMetrics();
}

// Retrieves data for the specified level from the levelData array.
function getLevelData(level) {
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

//Function selects a random the item that is the match for the round
function pickMatchingItem() {
    return Math.floor(Math.random() * numberOfGameImages);
}

/**
 * FUNCTION: CREATE ITEMS LIST 
 * Function that creates a list of 9 numbers, of which 1 is the number
 * of the machtingItem. The other 8 numbers are unique.
 * returns: list of numbers.
 */
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

/**
 * FUNCTION: CREATE ITEM IMAGES 
 * Arguments: (list, board)
 * Creates images for each item in the itemNumbers list and adds them to the specified board.
 * Each image allows selection on click and plays a hover sound on mouseover.
 */
function createItemImages(itemNumbers, boardId) {
    const board = document.getElementById(boardId);
    for (const itemNumber of itemNumbers) {
        const itemImg = new Image();
        itemImg.src = `images/item-images/${itemNumber}.png`;
        itemImg.alt = itemNumber;
        itemImg.addEventListener("click", selectItem);
        itemImg.addEventListener("mouseover", () => audioFiles.hover.play());
        board.appendChild(itemImg);
    }
}

//////////////////// GAME METRICS ///////////////////////
/**
 * FUNCTION: show Game Metrics
 * Shows the current amount of stars, time left, level & lifes
 */
function showGameMetrics() {
    starsContainer.innerHTML = stars < 1 ? 0 : stars;
    lifesContainer.innerHTML = lifes;
    levelContainer.innerHTML = level;
}

//////////////////// PLAYING THE GAME ///////////////////////

/**
 * FUNCTION: SELECT ITEM
 * When an item is selected it checks if it is correct or wrong.
 * It updates the scorebord and lifes.
 */
function selectItem() {
    if (this.alt == matchingItem) { // Correct item
        audioFiles.correct.play();
        stars++;
        stopTimer();
        setGame();
    } else { // Wrong item
        audioFiles.incorrect.play();
        stars--;
        showGameMetrics();
    }
    getGameStatus();
}

///////////// GAME STATUS | WINNER/LOSER ////////////////

/**
 * FUNCTION: CHECK GAME STATUS
 * Checks if winner/loser
 */
function getGameStatus() {
    if (stars === 0) {
        lostLife();
    } else if (stars === 5) { 
        gameEnd("winner"); // won of level
    }
}

//////////////////// TIMER ///////////////////////


/**
 * FUNCTION: START TIMER
 * Starts a timer for the specified duration in seconds.
 * If the time is up,it goes to gameEnd slow.
 */
function startTimer(duration) {
    let startTime = Date.now();
    let endTime = startTime + (duration * 1000);

    timerInterval = setInterval(() => {
        let timeLeft = Math.round((endTime - Date.now()) / 1000);
        if (timeLeft > 0) {
            timerContainer.innerHTML = timeLeft;
        } else {
            stopTimer();
            lostLife();
        }
    }, 1000);
}

/**
 * FUNCTION: STOP TIMER
 * Stops the timer interval
 */
function stopTimer() {
    clearInterval(timerInterval);
}

//////////////////// GAME END SCREEN ///////////////////////

/**
 * FUNCTION: GAME END
 * This function shows the endscreen of the game
 */
function gameEnd(gameFinish) {
    clearInterval(timerInterval);
    showElement(metricsContainer, false);
    clearElement(gameContainer);
    audioFiles.background.pause();
    stars = 0;

    // Create end board
    createBoard("endBoard");
    createBoardImage(gameFinish, "endBoard");

    // WINNER - To next level
    if (gameFinish == "winner") {
        audioFiles.winner.play();
        levelUp();
        addLife();
        let levelName = "Play level " + level + "!";
        createNewButton(levelName, "endBoard", "setGame");
    } 
    // LOSER - Restart Game
    else if (gameFinish == "loser" || gameFinish == "slow") {
        if (gameFinish == "slow") {
            audioFiles.slow.play();
        } else if (gameFinish == "loser") {
            audioFiles.loser.play();
        }
        createNewButton("Restart game!", "endBoard", "reloadPage");
    } 
    // LOST LIFE - Retry level
    else {
        createNewButton("Retry level!", "endBoard", "setGame");
    }
}

/**
 * FUNCTION: CREATE BOARD IMAGE
 * Checks if gameOver, timeUp, winner, start and creates image,
 * image is added to endscreen
 */
function createBoardImage(imageMessage, boardName, imageAction) {
    let boardImage = document.createElement("img");
    boardImage.src = "images/site-images/"+ imageMessage +".gif";
    let selectedBoard = document.getElementById(boardName);
    selectedBoard.appendChild(boardImage);
    boardImage.addEventListener("mouseover", () =>{audioFiles.hover.play();});
    if (imageAction == "setGame") {
        boardImage.addEventListener("click", () =>{setGame();});
    } else if (imageAction == "reloadPage") {
        boardImage.addEventListener("click", () =>{window.location.reload();});
    } else { // lost life 
        boardImage.addEventListener("click", () =>{setGame();});
    }
}

/**
 * FUNCTION: CREATE BUTTON
 * Adds it to info screen
 */
function createNewButton(buttonText, boardName, buttonAction) {
    let newButton = document.createElement("button");
    newButton.innerText = buttonText;
    let selectedBoard = document.getElementById(boardName);
    selectedBoard.appendChild(newButton);
    newButton.addEventListener("mouseover", () =>{audioFiles.hover.play();});

    if (buttonAction == "setGame") {
        newButton.addEventListener("click", () =>{setGame()});
    }
    else {
        newButton.addEventListener("click", () =>{window.location.reload();});
    }
}

//////////////////// LEVELS ///////////////////////

/**
 * FUNCTION: LEVEL UP
 * Clears the content of an html element
 */
function levelUp() {
    level++;
}

/**
 * FUNCTION: LIFES DOWN / UP
 * Clears the content of an html element
 */
function lostLife() {
    lifes--;
    console.log(lifes);
    if (lifes == 0) {
        gameEnd("loser");
    } else if (lifes > 0 && lifes <= 6) {
        console.log("lifes 0 tot 7");
        gameEnd("lostlife" + lifes);
    } else {
        gameEnd("loser");
    }
}

function addLife() {
    if (level % 3 === 0 && lifes < 7) {
        lifes++;
    }
}

//////////////////// GENERAL ///////////////////////

/**
 * FUNCTION: Show Element By ID
 * Takes 2 arguments: 
 *      element -> id of the element you want to show or hide
 *      show -> true / false
 */

function showElement(element, show) {
    element.style.visibility = show ? "visible" : "hidden";
}

/**
 * FUNCTION: CLEAR ELEMENT
 * Clears the content of an html element
 */
function clearElement(element) {
    element.innerHTML = "";
}


// -------------------- O L D -- C O D E ---------------------- //


// OLD CODE SHOW STARS:

/*for (let i = 0; i < stars; i++) {
    let starImg = document.createElement("img");
    starImg.src = "images/site-images/star.png";
    starsContainer.appendChild(starImg);
}

if (stars < 1) {
    let starImg = document.createElement("img");
    starImg.src = "images/site-images/stars.png";
    starsContainer.appendChild(starImg);
    stars = 0;
}

function changeBackgroundImage(imageName) {
    document.body.style.backgroundImage = `url('images/background-images/${imageName}')`;
}

*/



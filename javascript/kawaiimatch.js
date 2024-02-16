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
    starsCountContainer = document.getElementById("starsCountContainer"),
    levelContainer = document.getElementById("levelContainer"),
    timerContainer = document.getElementById("timerContainer"),
    gameContainer = document.getElementById("gameContainer"),
    lifesContainer = document.getElementById("lifesContainer"),

    // Number of images within images folder to show as item
    // P40 - https://www.freepik.com/author/freepik/icons/kawaii-lineal-color_47?t=f&sign-up=google&page=40#uuid=f3bfb0bd-e723-4676-b6ae-1c1daa026382
    numberOfGameImages = 72;

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
 * FUNCTION: SET GAME
 * Creates the game boards
 */
function setGame() {
    clearElement(gameContainer);
    showElement(metricsContainer, true);
    getLevelData(level);
    audioFiles.background.play();
    matchingItem = pickMatchingItem();
    itemsListA = createItemsList();
    itemsListB = createItemsList();
    createGameBoards();
    showGameMetrics();
}


function createGameBoards() {
    createBoard("board1");
    createBoard("board2");
    createItemImages(itemsListA, "board1");
    createItemImages(itemsListB, "board2");
}

/**
 * FUNCTION: show Game Metrics
 * Shows the current amount of stars, time and level
 */
function showGameMetrics() {
    showStars();
    showLifes();
    startTimer(timePerLevel);
    levelContainer.innerHTML = level;
}


/**
 * FUNCTION: changeBackgroundImage
 * arguments: imageName the name of an image in the folder background-images 
 */
function changeBackgroundImage(imageName) {
    document.body.style.backgroundImage = `url('images/background-images/${imageName}')`;
}

/**
 * FUNCTION: CREATE EMPTY BOARD
 * This function creates the boards
 */
function createBoard(boardId) {
    let board = document.createElement("div");
    board.id = boardId;
    board.classList.add("board");
    gameContainer.appendChild(board);
}

/**
 * FUNCTION: PICK MATCHING ITEM
 * Function selects a random the item that is the match for the round
 */
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
        let randomNumber = Math.floor(Math.random() * numberOfGameImages);
        if (!numbers.includes(randomNumber) 
            && randomNumber != matchingItem
            && !itemsListA.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    // Add number of the matchingItem on random position in the list
    let randomIndex = Math.floor(Math.random() * 9);
    numbers.splice(randomIndex, 0, matchingItem);
    return numbers;
}

/**
 * FUNCTION: CREATE ITEM IMAGES 
 * Arguments: (list, board)
 * This function creates an image for each item in the board
 * and add this image to the board
 */
function createItemImages(itemNumbers, boardId) {
    let board = document.getElementById(boardId);
    itemNumbers.forEach((itemNumber) => {
        let itemImg = document.createElement("img");
        itemImg.src = "images/item-images/" + itemNumber + ".png";
        itemImg.alt = itemNumber;
        itemImg.addEventListener("click", selectItem);
        itemImg.addEventListener("mouseover", () =>{audioFiles.hover.play();});
        board.appendChild(itemImg);
    });
}

//////////////////// STARS ///////////////////////

/**
 * FUNCTION: CREATE STARS
 * This function creates images for the amount of stars
 */
function showStars() {
    clearElement(starsContainer);

    for (let i = 0; i < stars; i++) {
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
    starsCountContainer.innerHTML = stars;
}

/**
 * FUNCTION: show Lifes
 * This function creates images for the amount of stars
 */
function showLifes() {
    lifesContainer.innerHTML = lifes;
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
        showStars();
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
        if (lifes === 2) {
            gameEnd("lostlife2");
        } else if (lifes === 1) {
            gameEnd("lostlife1");
        } else {
            gameEnd("loser"); // lost the level
        }
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
            if (lifes === 2) {
                gameEnd("lostlife2");
            } else if (lifes === 1) {
                gameEnd("lostlife1");
            } else {
                gameEnd("slow");
            }
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

    if (gameFinish == "winner") {
        audioFiles.winner.play();
        levelUp();
        let levelName = "Play level " + level + "!";
        createNewButton(levelName, "endBoard", "setGame");
    } else if (gameFinish == "lostlife2" || gameFinish == "lostlife1") {
        createNewButton("Retry level!", "endBoard", "setGame");
    } else if (gameFinish == "loser" || gameFinish == "slow") {
        if (gameFinish == "slow") {
            audioFiles.slow.play();
        } else if (gameFinish == "loser") {
            audioFiles.loser.play();
        }
        createNewButton("Restart Game!", "endBoard", "reloadPage");
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
        boardImage.addEventListener("click", () =>{setGame()});
    } else if (imageAction == "reloadPage") {
        boardImage.addEventListener("click", () =>{window.location.reload();});
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
 * FUNCTION: GAME END
 * This function shows the endscreen of the game
 */
function createNextLevelBoard() {
    // Clear interval, container info, pause music
    clearInterval(timerInterval);
    clearElement(gameContainer);

    // Create nextLevel board
    createBoard("nextLevelBoard");
    createBoardImage(level, "nextLevelBoard");
    createNewButton("Next level!", "nextLevelBoard", "reloadPage");
}

/**
 * FUNCTION: LEVEL UP
 * Clears the content of an html element
 */
function levelUp() {
    level++;
}

/**
 * FUNCTION: LIFES DOWN
 * Clears the content of an html element
 */
function lostLife() {
    lifes--;
}

/**
 * FUNCTION: SELECTS DATA FOR THE NEW LEVEL
 */
function getLevelData(level) {
    const data = levelData[level - 1];
    timePerLevel = data.time;
    numberOfItemsPerLevel = data.numberOfItems;
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



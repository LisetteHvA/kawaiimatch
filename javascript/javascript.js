/**
 * NAME:        KAWAII MATCH
 * AUTHOR:      Lisette Pool
 * DESCRIPTION: Search the matching item and click it to gain points.
 *              If you have 5 stars, you can go to the next round.
 *              When a user clicks a wrong item, its game over, 
 *              unles you have a star, then you lose it.
 */

// CONSTANTS

/*
const gameElements = {
    gameContainer: document.getElementById("gameContainer"),
    starsContainer: document.getElementById("stars"),
    timerContainer: document.getElementById("timerContainer"),
    levelContainer: document.getElementById("levelContainer"),
};
*/

const audioFiles = {
    background: new Audio("sounds/background.mp3"),
    hover: new Audio("sounds/hover.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    incorrect: new Audio("sounds/incorrect.mp3"),
    winner: new Audio("sounds/winner.mp3"),
    loser: new Audio("sounds/loser.mp3"),
    slow: new Audio("sounds/slow.mp3"),
};

const   // Game board html elements
    gameContainer = document.getElementById("gameContainer"),
    starsContainer = document.getElementById("starsContainer"),
    timerContainer = document.getElementById("timerContainer"),
    levelContainer = document.getElementById("levelContainer"),

    // Number of images within images folder to show as item
    numberOfGameImages = 33;

// VARIABLES
let stars = 0;
let level = 1;
let matchingItem;
let itemsListA = [];
let itemsListB = [];
let timeLeft = 0;
let timePerLevel;
let numberOfItemsPerLevel;
let timerInterval;

//////////////////// START GAME ///////////////////////
window.onload = function() {
    startGame();
}

/**
 * FUNCTION: START GAME
 * Creates the game boards
 */
function startGame() {
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
    setupLevel(level);

    //Play background music
    audioFiles.background.play();

    // Choose items, create boards and add images to the boards
    matchingItem = pickMatchingItem();
    itemsListA = createItemsList();
    itemsListB = createItemsList();
    createBoard("board1");
    createBoard("board2");
    createItemImages(itemsListA, "board1");
    createItemImages(itemsListB, "board2");

    // Set game info
    showStars();
    startTimer(timePerLevel);
}

/**
 * FUNCTION: CLEAR ELEMENT
 * Clears the content of an html element
 */
function clearElement(element) {
    element.innerHTML = "";
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
function createItemImages(list, boardId) {
    let board = document.getElementById(boardId);
    list.forEach((itemNumber) => {
        let itemImg = document.createElement("img");
        itemImg.src = "item-images/" + itemNumber + ".png";
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
        starImg.src = "site-images/star.png";
        starsContainer.appendChild(starImg);
    }
    if (stars < 1) {
        let starImg = document.createElement("img");
        starImg.src = "site-images/stars.png";
        starsContainer.appendChild(starImg);
        stars = 0;
    }
}

//////////////////// PLAYING THE GAME ///////////////////////

/**
 * FUNCTION: SELECT ITEM
 * When an item is selected it checks if it is correct or wrong.
 * It updates the scorebord and lives.
 */
function selectItem() {
    // When correct item is clicked
    if (this.alt == matchingItem) {
        audioFiles.correct.play();
        stars++;
        stopTimer();
        setGame();
    } 
    // When wrong item is clicked
    else {
        audioFiles.incorrect.play();
        stars--;
        showStars();
    }
    // Check if there is a winner/loser
    getGameStatus();
}

///////////// GAME STATUS | WINNER/LOSER ////////////////

/**
 * FUNCTION: CHECK GAME STATUS
 * Checks if winner/loser
 */
function getGameStatus() {
    if (stars == 0) { // loser
        gameEnd("loser");
    }
    if (stars == 5) { // winner
        gameEnd("winner");
        levelUp();
    }
}

//////////////////// TIMER ///////////////////////

/**
 * FUNCTION: START TIMER
 * Sets timer for 'duration' minutes.
 * If the time is up, the game is over.
 */
function startTimer(duration) {
    let startTime = Date.now();
    let endTime = startTime + (duration * 1000);
    timerInterval = setInterval(() => {
        let timeLeft = Math.round((endTime - Date.now()) / 1000);
        if (timeLeft <= 0) {
            stopTimer();
            gameEnd("slow");
        } else {
            timerContainer.innerHTML = timeLeft;
        }
    }, 1000);
}

/**
 * FUNCTION: STOP TIMER
 * Stops the timer interval
 */
function stopTimer() {
    clearInterval(timerInterval);
    clearElement(timerContainer);
}

//////////////////// GAME END SCREEN ///////////////////////

/**
 * FUNCTION: GAME END
 * This function shows the endscreen of the game
 */
function gameEnd(gameFinish) {
    // Clear interval, container info, pause music
    clearInterval(timerInterval);
    clearElement(gameContainer);
    audioFiles.background.pause();

    // Create end board
    createBoard("endBoard");
    createBoardImage(gameFinish, "endBoard");
    
    // update sterren
    stars = 0;
    showStars();

    if (gameFinish == "winner") {
        audioFiles.winner.play();
        createNewButton("Next Level!", "endBoard", "setGame");
    } else if (gameFinish == "loser") {
        audioFiles.loser.play();
        createNewButton("Play Again!", "endBoard", "reloadPage");
    } else if (gameFinish == "slow") {
        audioFiles.slow.play();
        createNewButton("Play Again!", "endBoard", "reloadPage");
    }
}

/**
 * FUNCTION: CREATE BOARD IMAGE
 * Checks if gameOver, timeUp, winner, start and creates image,
 * image is added to endscreen
 */
function createBoardImage(imageMessage, boardName, imageAction) {
    let boardImage = document.createElement("img");
    boardImage.src = "site-images/"+ imageMessage +".gif";
    let selectedBoard = document.getElementById(boardName);
    selectedBoard.appendChild(boardImage);
    boardImage.addEventListener("mouseover", () =>{audioFiles.hover.play();});
    
    if (imageAction == "setGame") {
        boardImage.addEventListener("click", () =>{setGame()});
    } else if (imageAction == "reloadPage") {
        boardImage.addEventListener("click", () =>{window.location.reload();});
    } else {
        
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
 * FUNCTION: SETS UP A NEW LEVEL
 * This function shows the endscreen of the game
 */
function setupLevel(level) {
    switch (level) {
        case 1:
            timePerLevel = 30;
            numberOfItemsPerLevel = 9;
            break;
        case 2:
            timePerLevel = 20;
            numberOfItemsPerLevel = 6;
            break;
        case 3:
            timePerLevel = 15;
            numberOfItemsPerLevel = 9;
            break;
        case 4:
            timePerLevel = 15;
            numberOfItemsPerLevel = 12;
            break;
        case 5:
            timePerLevel = 7;
            numberOfItemsPerLevel = 6;
            break;
        default:
            console.error("Invalid level!");
            return;
    }
    levelContainer.innerHTML = level;
}


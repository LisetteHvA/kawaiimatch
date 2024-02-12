/**
 * NAME:        KAWAII MATCH
 * AUTHOR:      Lisette Pool
 * DESCRIPTION: Search the matching item and click it to gain points.
 *              When a user clicks a wrong item, after 5 times, its game over.
 */

// CONSTANTS

/*
const gameElements = {
    gameInfo: document.getElementById("gameInfo"),
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
    gameInfo = document.getElementById("gameInfo"),
    gameContainer = document.getElementById("gameContainer"),
    starsContainer = document.getElementById("stars"),
    timerContainer = document.getElementById("timerContainer"),
    levelContainer = document.getElementById("levelContainer"),

    // Number of images within images folder to show as item
    numberOfGameImages = 33;

// VARIABLES
let stars = 0;
let level = 0;
let matchingItem;
let itemsListA = [];
let itemsListB = [];
let timeLeft = 0;
let timePerLevel;
let timerInterval;

//////////////////// START GAME ///////////////////////
/**
 * START GAME
 * Games starts when page is loaded.
 */
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
    // Empty game container
    clearElement(gameContainer);

    //Play background music
    audioFiles.background.play();

    // Choose items
    matchingItem = pickMatchingItem();
    itemsListA = createItemsList();
    itemsListB = createItemsList();

    // Create boards
    createBoard("board1");
    createBoard("board2");

    // Create images for each item and add to board
    createItemImages(itemsListA, "board1");
    createItemImages(itemsListB, "board2");

    // Set game info
    setTimerTo(15);
    startTimer(timePerLevel);
    showStars(); 
}

/**
 * FUNCTION: CLEAR ELEMENT
 * Clears the content of an html element
 */
function clearElement(element) {
    element.innerHTML = "";
}

/**
 * FUNCTION: LEVEL UP
 * Clears the content of an html element
 */
function levelUp() {
    level++;
    levelContainer.innerHTML = "Level: "+ level;
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
    while (numbers.length < 8) {
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
    // Reset timer
    clearInterval(timerInterval);
    clearElement(timerContainer);

    // When correct item is clicked
    if (this.alt == matchingItem) {
        audioFiles.correct.play();
        stars++;
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
 * FUNCTION: SET TIMER
 * Change the time you have to play th level 
 */
function setTimerTo(amountOfSeconds){
    timePerLevel = amountOfSeconds;
}

/**
 * FUNCTION: START TIMER
 * Sets timer for 'duration' minutes.
 * If the time is up, the game is over.
 */
function startTimer(duration) {
    clearElement(timerContainer);
    let startTime = Date.now();
    let endTime = startTime + (duration * 1000);
    timerInterval = setInterval(() => {
        let timeLeft = Math.round((endTime - Date.now()) / 1000);
        // When there is no time left - end game
        if (timeLeft <= 0) {
            gameEnd("slow");
        } else { // update time
            timerContainer.innerHTML = timeLeft + " seconds";
        }
    }, 1000);
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
    clearElement(gameInfo);
    audioFiles.background.pause();

    if (gameFinish == "winner") {
        audioFiles.winner.play();
    } else if (gameFinish == "loser") {
        audioFiles.loser.play();
    } else if (gameFinish == "slow") {
        audioFiles.slow.play();
    }

    // Create end board
    createBoard("endBoard");
    createBoardImage(gameFinish, "endBoard");
    createNewButton("Play Again!", "endBoard", "reloadPage");
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

//////////////////// LEVEL UP SCREEN ///////////////////////

/**
 * FUNCTION: GAME END
 * This function shows the endscreen of the game
 */
function createNextLevelBoard() {
    // Clear interval, container info, pause music
    clearInterval(timerInterval);
    clearElement(gameContainer);
    clearElement(gameInfo);

    // Create nextLevel board
    createBoard("nextLevelBoard");
    createBoardImage(level, "nextLevelBoard");
    createNewButton("Next level!", "nextLevelBoard", "reloadPage");
}

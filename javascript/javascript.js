/**
 * NAME:        KAWAII MATCH
 * AUTHOR:      Lisette Pool
 * DESCRIPTION: Search the matching item and click it to gain points.
 *              When a user clicks a wrong item, after 5 times, its game over.
 */

/**
 * CONSTANTS & VARIABLES
 */

// CONSTANTS
const   // Game board items
        board1 = document.getElementById("board1"),
        board2 = document.getElementById("board2"),
        gameInfo = document.getElementById("gameInfo"),
        gameContainer = document.getElementById("gameContainer"),
        restartButton = document.getElementById("restartButton"),
        scorebord = document.getElementById("score"),
        starsContainer = document.getElementById("stars"),
        numberOfGameImages = 33, // number of images in images folder to show in game

        // Audio
        backgroundSound = new Audio("sounds/background.mp3"),
        correctSound = new Audio("sounds/correct.mp3"),
        foutSound = new Audio("sounds/fout.mp3"),
        hoverSound = new Audio("sounds/hover.mp3"),
        winnerSound = new Audio("sounds/winner.mp3"),
        gameOverSound = new Audio("sounds/gameover.mp3");

// VARIABLES
let stars = 0;
let gameOver = false;
let matchingItem;
let itemsListA = [];
let itemsListB = [];

// EVENTLISTENERS
//restartButton.addEventListener("click", resetGame());

/**
 * START GAME
 * Games starts when page is loaded.
 */
window.onload = function() {
    setGame();
}

/**
 * FUNCTION: SET GAME
 * Creates the game boards
 */
function setGame() {
    //Play background music
    backgroundSound.play();
    
    // Reset Game
    gameContainer.innerHTML = "";

    // Show stars
    showStars();

    // Choose items
    matchingItem = Math.floor(Math.random() * 22);
    itemsListA = createItemsList();
    itemsListB = createItemsList();

    // Create boards
    createBoards(2);

    // Create images for each item
    createItemImages(itemsListA, "board1");
    createItemImages(itemsListB, "board2");
}

/**
 * FUNCTION: RESET GAME
 * This function refreshes the page so a new game starts
 */
function resetGame() {
    location.reload();
}

/**
 * FUNCTION: CREATE EMPTY BOARD
 * This function creates the boards
 */
function createBoards(numberOfBoards) {
    for (let i = 1; i < numberOfBoards+1; i++) {
        let board = document.createElement("div");
        board.id = "board"+i;
        board.classList.add("board");
        gameContainer.appendChild(board);
    }
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
        itemImg.src = "images/"+itemNumber+".png";
        itemImg.alt = itemNumber;
        itemImg.addEventListener("click", selectItem);
        itemImg.addEventListener("mouseover", () =>{hoverSound.play();});
        board.appendChild(itemImg);
    });
}


/**
 * FUNCTION: CREATE STARS
 * This function creates images for the amount of stars
 */
function showStars() {
    starsContainer.innerHTML = "";
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

/**
 * FUNCTION: SELECT ITEM
 * When an item is selected it checks if it is correct or wrong.
 * It updates the scorebord and lives.
 */
function selectItem() {
    // correct item is clicked
    if (this.alt == matchingItem) {
        correctSound.play();
        stars++;
        setGame();
    // wrong item is clicked
    } else {
        foutSound.play();
        stars--;
        showStars();
    }
    // gameOver
    if (stars == 0) {
        stars = 0;
        gameOverSound.play();
        //resetGame();
        return;
    }
    if (stars == 5) {
        console.log("je wint!");
        winnerSound.play();
        scorebord.innerText = "Amazing, you've collected all 5 stars!";
    }
}

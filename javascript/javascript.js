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
        timerContainer = document.getElementById("timerContainer"),
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
let timeLeft = 0;
let timePerLevel = 30; //in seconds
let timerInterval;

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

    // Start de timer voor 2 minuten (120 seconden)
    startTimer(timePerLevel);
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
 * FUNCTION: GAME END
 * This function shows the endscreen of the game
 */
function gameEnd(winnerOrLoser) {
    backgroundSound.pause();
    gameContainer.innerHTML = "";

    // Create board
    createBoards(1);
    let board = document.getElementById("board1");
    board.id = "endBoard";

    // Add images to board
    let endImage = document.createElement("img");
    endImage.src = "site-images/"+ winnerOrLoser +".gif";
    endBoard.appendChild(endImage);
    endImage.addEventListener("mouseover", () =>{hoverSound.play();});
    endImage.addEventListener("click", () =>{window.location.reload();});

    // Add text to board
    let playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again!";
    endBoard.appendChild(playAgainButton);
    playAgainButton.addEventListener("mouseover", () =>{hoverSound.play();});
    playAgainButton.addEventListener("click", () =>{window.location.reload();});
}

/**
 * FUNCTION: SELECT ITEM
 * When an item is selected it checks if it is correct or wrong.
 * It updates the scorebord and lives.
 */
function selectItem() {
    clearInterval(timerInterval);
    timerContainer.innerHTML = "";

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
        gameEnd("loser");
        gameOverSound.play();
        return;
    }
     // winner
    if (stars == 5) {
        gameEnd("winner");
        winnerSound.play();
    }
}

/**
 * FUNCTION: START TIMER
 * Sets timer for 'duration' minutes.
 * If the time is up, the game is over.
 */
function startTimer(duration) {
    timerContainer.innerHTML = "";
    let startTime = Date.now();
    let endTime = startTime + (duration * 1000);

    timerInterval = setInterval(() => {
        let timeLeft = Math.round((endTime - Date.now()) / 1000);

        // Play music faster when running out of time.
        if (timeLeft <= 15) {
            backgroundSound.playbackRate = 1.3;
        }
        if (timeLeft <= 8) {
            backgroundSound.playbackRate = 1.7;
        }

        // Check if there is still time left to play
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameEnd("slow");

        // Update the timer on the website
        } else {
            timeStr = timeLeft.toString();
            timerContainer.innerHTML = timeLeft + " seconds";
        }
    }, 1000);
}

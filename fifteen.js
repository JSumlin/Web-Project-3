var sizeOfRow = 4;
var numOfCells = 16;
var isShuffling = false;
let timer;
let moves = 0;
let time = 1;
let bestTime = Number.MAX_SAFE_INTEGER;
let bestMoves = Number.MAX_SAFE_INTEGER;
const slidingSound = new Audio("sliding.wav");
const victorySound = new Audio("victory.mp3")

function checkGameSolved() {
    const cells = document.querySelectorAll('.cell');
    let solved = true;

    // Checks to see if each active piece is in its correct position
    cells.forEach((cell, index) => {
        if (!cell.classList.contains('inactive')) {
            const pieceNumber = index + 1;
            const pieceId = pieceNumber < 10 ? 'piece0' + pieceNumber : 'piece' + pieceNumber;

            if (!cell.classList.contains(pieceId)) {
                solved = false;
            }
        }
    });

    return solved;
}

// Handles the solved state
function handleGameSolved() {
    stopTimer();
    playWinningSound();
    getBestStats();
    pauseBackgroundMusic();

    document.getElementById("gameBoard").classList.add("solved");

    // Display congratulatory message
    const congratulations = document.getElementById("congratulations");
    congratulations.style.display = "block";


    const winImage = document.getElementById("winImage");
    winImage.style.display = "block";

    win();
}

// Function to be called when the user wins
function win() {
    document.body.classList.add("win-background");
    document.getElementById('rules').className = "winText";
    document.getElementById('rules').innerHTML = "You Win!";
}

// Function to check the game state after each move
function checkGameState() {
    if (checkGameSolved()) {
        handleGameSolved();
    }
}

// Adds click listener to all moveable pieces
function addListeners() {
    var moveablepieces = document.getElementsByClassName("moveablepiece");
    for (let i = 0; i < moveablepieces.length; ++i) {
        moveablepieces[i].addEventListener("click", onClick);
    }
}

// Removes all listeners and removes all divs from the moveable piece class
function removeListeners() {
    var moveablepieces = document.getElementsByClassName("moveablepiece");
    while (moveablepieces.length > 0) {
        moveablepieces[0].removeEventListener("click", onClick);
        moveablepieces[0].className = moveablepieces[0].className.replace(" moveablepiece", "");
    }
}

function onClick(event) {
    movePiece(event);
    removeListeners();
    setMoveablePieces();
    addListeners();
    setMoves();
    
	if(!isShuffling){
        checkGameState();
    }
}

// Moves the appropriate piece to the inactive position and sets its previous position as inactive
function movePiece(event) {
    const target = event.currentTarget;
    const inactiveCell = document.getElementsByClassName("inactive")[0];
    const piece = target.children[0];
    const pieceNumber = parseInt(piece.id.substring(5));
    inactiveCell.innerHTML = target.innerHTML;
    target.innerHTML = "";
    inactiveCell.className = inactiveCell.className.replace("inactive", "active");
    inactiveCell.className += ` ${piece.id}`;
    inactiveCell.style = `background-position: ${((pieceNumber - 1) % sizeOfRow) * -100}px ${Math.floor((pieceNumber - 1) / sizeOfRow) * -100}px;`;
    target.className = target.className.replace(` ${piece.id}`, "");
    target.className = target.className.replace("active", "inactive");
    target.style = "";
}

// Identifies which pieces should be moveable and adds them to the moveable piece class
function setMoveablePieces() {
    const inactiveCell = document.getElementsByClassName("inactive")[0];
    var inactivePosition = parseInt(inactiveCell.id.substring(12));
    var moveablePositions = [inactivePosition - 1, inactivePosition + 1, inactivePosition + sizeOfRow, inactivePosition - sizeOfRow];
    for (var i = 0; i < moveablePositions.length; ++i) {
        if (moveablePositions[i] > 0 && moveablePositions[i] <= numOfCells) {
            if (inactivePosition % sizeOfRow === 0 && moveablePositions[i] === inactivePosition + 1)
                continue;
            if (inactivePosition % sizeOfRow === 1 && moveablePositions[i] === inactivePosition - 1)
                continue;
            if (moveablePositions[i] < 10)
                moveablePositions[i] = "0" + moveablePositions[i];
            let moveablePosition = document.getElementById("cellPosition" + moveablePositions[i]);
            moveablePosition.className += " moveablepiece";
        }
    }
}

// Simulates 100 - 249 clicks to shuffle the gameboard
function shuffle() {
    isShuffling = true;
    var moveablepieces;
    var randomPiece;
    const numOfMoves = getRandomInt(sizeOfRow * 25) + sizeOfRow * 50;
    for (let i = 0; i < numOfMoves; ++i) {
        moveablepieces = document.getElementsByClassName("moveablepiece");
        randomPiece = moveablepieces[getRandomInt(moveablepieces.length)];
        randomPiece.click();
    }
    isShuffling = false;
}

function changeBoardSize() {
    var sizeBarValue = parseInt(document.getElementById("sizeBar").value);
    sizeOfRow = sizeBarValue;
    removeListeners();
    setBoard(sizeBarValue);
    setMoveablePieces();
    addListeners();
}

function setBoard(sizeBarValue) {
    numOfCells = sizeBarValue * sizeBarValue;
    const gameBoard = document.getElementById("gameBoard");
    var numberSuffix;
    gameBoard.innerHTML = "";
    setGrid(gameBoard, sizeBarValue);
    for (var i = 1; i < numOfCells; ++i) {
        if (i < 10) numberSuffix = "0" + i;
        else numberSuffix = "" + i;
        gameBoard.innerHTML += `\n<div class="cell active piece${numberSuffix}" id="cellPosition${numberSuffix}"></div>`;
        document.getElementById(`cellPosition${numberSuffix}`).innerHTML = `<p id="piece${numberSuffix}">${i}</p>`;
    }

    if (numOfCells < 10) numberSuffix = "0" + i;
    else numberSuffix = "" + i;
    gameBoard.innerHTML += `\n<div class="cell inactive" id="cellPosition${numberSuffix}"></div>`;
    setBackgroundPosition(gameBoard);
}

// Adjusts the game board's grid to the appropriate layout
function setGrid(gameBoard, sizeBarValue) {
    var gridString = "";
    var styleString = "";
    for (let i = 0; i < sizeBarValue; ++i) {
        gridString += " 102px";
    }
    styleString += `\ngrid-template-columns:${gridString};\ngrid-template-rows:${gridString};`
    gameBoard.style = styleString;
}

// Sets the background position of each cell to display correctly
function setBackgroundPosition(gameBoard) {
    var cells = gameBoard.children;
    for (var a = 0; a < cells.length; ++a) {
        cells[a].style = `background-position: ${(a % sizeOfRow) * -100}px ${Math.floor(a / sizeOfRow) * -100}px;`;
    }
}

// Generates random number up to but not including the max. Has uniform PDF
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// button trigger
function shuffleButton() {
    pauseBackgroundMusic();
    shuffle();
    startTimer();
    document.getElementById("moves").innerHTML = '';
    moves = 0;
    playBackgroundMusic(); 
    document.getElementById("winImage").style.display = "none";
    document.getElementById("congratulations").style.display = "none";
	
  
    setTimeout(checkGameState, 500);
}
//add when game is solved
function stopTimer(){
    clearInterval(timer);
}

// add when game is solved
function getBestStats() {
    if (time < bestTime || (time === bestTime && moves < bestMoves)) {
        bestTime = time;
        bestMoves = moves;
        document.getElementById("bestTime").textContent = `Best Time: ${bestTime}s`;
        document.getElementById("bestMoves").textContent =  `Best Moves: ${bestMoves}`;
    }
}

function startTimer(){
    clearInterval(timer);
    time = 1;
    timer = setInterval(function() {
        document.getElementById("timer").textContent = time + "s";
        time++;
    }, 1000);
}

function setMoves() {
    slidingSound.play();
    moves++;
    document.getElementById("moves").textContent = moves;
}

//add when game is solved
function playWinningSound(){
    victorySound.play();
}

function playBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.play();
}

// add when game is solved
function pauseBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.pause();
}

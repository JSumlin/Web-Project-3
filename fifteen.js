// Adds click listener to all moveable pieces
function addListeners() {
    var moveablepieces = document.getElementsByClassName("moveablepiece");
    for(let i=0; i<moveablepieces.length; ++i){
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
}

// Moves the appropriate piece to the inactive position and sets its previous position as inactive
function movePiece(event) {
    const target = event.currentTarget;
    const inactiveCell = document.getElementsByClassName("inactive")[0];
    const piece = target.children[0];
    inactiveCell.innerHTML = target.innerHTML;
    target.innerHTML = "";
    inactiveCell.className = inactiveCell.className.replace("inactive", "active");
    inactiveCell.className += ` ${piece.id}`;
    target.className = target.className.replace(" moveablepiece", "");
    target.className = target.className.replace(` ${piece.id}`, "");
    target.className = target.className.replace("active", "inactive");
}

// Identifies which pieces should be moveable and adds them to the moveable piece class
function setMoveablePieces(){
    const inactiveCell = document.getElementsByClassName("inactive")[0];
    var inactivePosition =  parseInt(inactiveCell.id.substring(12));
    var moveablePositions = [inactivePosition - 1, inactivePosition + 1, inactivePosition + 4, inactivePosition - 4];
    for(var i = 0; i<moveablePositions.length; ++i) {
        if(moveablePositions[i] > 0 && moveablePositions[i] < 17) {
            if(moveablePositions[i] < 10) {
                moveablePositions[i] = "0" + moveablePositions[i];
            }
            let moveablePosition = document.getElementById("cellPosition" + moveablePositions[i]);
            moveablePosition.className += " moveablepiece";
        }
    }
}

// Simulates 100 - 249 clicks to shuffle the gameboard
function shuffle(){
    var moveablepieces;
    var randomPiece;
    const numOfMoves = getRandomInt(100) + 150;
    for(let i =0; i<numOfMoves; ++i){
        moveablepieces = document.getElementsByClassName("moveablepiece");
        randomPiece = moveablepieces[getRandomInt(moveablepieces.length)];
        randomPiece.click();
    }
}

// Generates random number up to but not including the max. Has uniform PDF
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
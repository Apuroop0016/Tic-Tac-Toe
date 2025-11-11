const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("data-index");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}
function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
        // If it's computer's turn (O), make a move
        if(currentPlayer === "O" && running) {
            setTimeout(makeComputerMove, 500); // Add slight delay for better UX
        }
    }
}
function findBestMove() {
    // First try to win
    for(let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        // Check if we can win in this line
        if(options[a] === "O" && options[b] === "O" && options[c] === "") return c;
        if(options[a] === "O" && options[c] === "O" && options[b] === "") return b;
        if(options[b] === "O" && options[c] === "O" && options[a] === "") return a;
    }

    // Then block player's winning move
    for(let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        // Check if player can win in this line
        if(options[a] === "X" && options[b] === "X" && options[c] === "") return c;
        if(options[a] === "X" && options[c] === "X" && options[b] === "") return b;
        if(options[b] === "X" && options[c] === "X" && options[a] === "") return a;
    }

    // Try to take center if available
    if(options[4] === "") return 4;

    // Try to take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => options[corner] === "");
    if(availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(side => options[side] === "");
    if(availableSides.length > 0) {
        return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1; // No moves available
}

function makeComputerMove() {
    if(!running) return;
    
    const moveIndex = findBestMove();
    if(moveIndex >= 0) {
        const cell = document.querySelector(`[data-index="${moveIndex}"]`);
        updateCell(cell, moveIndex);
        checkWinner();
    }
}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Your turn (X)`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}
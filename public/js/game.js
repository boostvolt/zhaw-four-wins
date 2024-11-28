let state = {
  board: Array(6)
    .fill("")
    .map(() => Array(7).fill("")),
  currentPlayer: "r",
};

function showBoard() {
  const boardElement = document.querySelector(".board");
  boardElement.innerHTML = "";
  
  const boardContent = ["div", { class: "board-inner" }];
  
  state.board.forEach((row) => {
    row.forEach((cell, colIndex) => {
      const fieldContent = ["div", { class: "field", "data-col": colIndex }];
      if (cell) {
        fieldContent.push(["div", { 
          class: `piece ${cell === "r" ? "red" : "blue"}`
        }]);
      }
      boardContent.push(fieldContent);
    });
  });
  
  renderSJDON(boardContent, boardElement);

  document.querySelector(".game-info").textContent = `${
    state.currentPlayer === "r" ? "Rot" : "Blau"
  } ist am Zug`;
}

function getLowestEmptyRow(col) {
  for (let row = 5; row >= 0; row--) {
    if (state.board[row][col] === "") {
      return row;
    }
  }
  return -1;
}

function connect4Winner(player, board) {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === player &&
                board[row][col + 1] === player &&
                board[row][col + 2] === player &&
                board[row][col + 3] === player) {
                return true;
            }
        }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === player &&
                board[row + 1][col] === player &&
                board[row + 2][col] === player &&
                board[row + 3][col] === player) {
                return true;
            }
        }
    }

    // Check diagonals
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            // Diagonal down-right
            if (row < 3 && 
                board[row][col] === player &&
                board[row + 1][col + 1] === player &&
                board[row + 2][col + 2] === player &&
                board[row + 3][col + 3] === player) {
                return true;
            }
            // Diagonal up-right (fixed)
            if (row > 2 && 
                board[row][col] === player &&
                board[row - 1][col + 1] === player &&
                board[row - 2][col + 2] === player &&
                board[row - 3][col + 3] === player) {
                return true;
            }
        }
    }
    return false;
}

function makeMove(col) {
  const row = getLowestEmptyRow(col);
  if (row !== -1) {
    state.board[row][col] = state.currentPlayer;
    if (connect4Winner(state.currentPlayer, state.board)) {
      showBoard();
      document.querySelector(".game-info").textContent = 
        `${state.currentPlayer === "r" ? "Rot" : "Blau"} hat gewonnen!`;
      return;
    }
    state.currentPlayer = state.currentPlayer === "r" ? "b" : "r";
    showBoard();
  }
}

function resetGame() {
  state.board = Array(6)
    .fill("")
    .map(() => Array(7).fill(""));
  state.currentPlayer = "r";
  showBoard();
}

async function saveGame() {
  // Try to save to server first
  try {
    await fetch("http://localhost:3000/api/data/game?api-key=c4game", {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(state)
    });
    document.querySelector("#saveServer").disabled = false;
  } catch (e) {
    console.error("Failed to save game to server:", e);
    document.querySelector("#saveServer").disabled = true;
  }
}

function saveGameLocal() {
  try {
    localStorage.setItem('connect4game', JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game to localStorage:", e);
  }
}

async function loadGame() {
  try {
    const response = await fetch("http://localhost:3000/api/data/game?api-key=c4game");
    const data = await response.json();
    state = data;
    showBoard();
    document.querySelector("#loadServer").disabled = false;
  } catch (e) {
    console.error("Failed to load game from server:", e);
    document.querySelector("#loadServer").disabled = true;
  }
}

function loadGameLocal() {
  try {
    const savedState = localStorage.getItem('connect4game');
    if (savedState) {
      state = JSON.parse(savedState);
      showBoard();
    }
  } catch (e) {
    console.error("Failed to load game from localStorage:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.querySelector(".board");
  
  boardElement.addEventListener("click", (e) => {
    const field = e.target.closest(".field");
    if (field) {
      const col = field.getAttribute("data-col");
      makeMove(parseInt(col));
    }
  });

  document.querySelector("#newGame").addEventListener("click", resetGame);
  document.querySelector("#saveGame").addEventListener("click", saveGame);
  document.querySelector("#loadGame").addEventListener("click", loadGame);
  document.querySelector("#saveLocal").addEventListener("click", saveGameLocal);
  document.querySelector("#loadLocal").addEventListener("click", loadGameLocal);
  
  // Test server connectivity
  fetch("http://localhost:3000/api/data/game?api-key=c4game")
    .catch(() => {
      document.querySelector("#saveGame").disabled = true;
      document.querySelector("#loadGame").disabled = true;
    });
    
  showBoard();
});

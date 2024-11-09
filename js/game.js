let state = {
  board: Array(6)
    .fill("")
    .map(() => Array(7).fill("")),
  currentPlayer: "r",
};

function showBoard() {
  const boardElement = document.querySelector(".board");
  boardElement.innerHTML = "";

  state.board.forEach((row) => {
    row.forEach((cell, colIndex) => {
      const field = elt("div", {
        class: "field",
        "data-col": colIndex,
      });
      if (cell) {
        const piece = elt("div", {
          class: `piece ${cell === "r" ? "red" : "blue"}`,
        });
        field.appendChild(piece);
      }
      boardElement.appendChild(field);
    });
  });

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

function makeMove(col) {
  const row = getLowestEmptyRow(col);
  if (row !== -1) {
    state.board[row][col] = state.currentPlayer;
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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".board").addEventListener("click", (e) => {
    const field = e.target.closest(".field");
    if (field) {
      const col = field.getAttribute("data-col");
      makeMove(parseInt(col));
    }
  });

  document.querySelector("#newGame").addEventListener("click", resetGame);
  showBoard();
});

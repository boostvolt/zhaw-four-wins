let state = {
  board: Array(6)
    .fill("")
    .map(() => Array(7).fill("")),
};

function showBoard() {
  const boardElement = document.querySelector(".board");
  boardElement.innerHTML = "";

  state.board.forEach((row) => {
    row.forEach((cell) => {
      const field = elt("div", { class: "field" });
      if (cell) {
        const piece = elt("div", {
          class: `piece ${cell === "r" ? "red" : "blue"}`,
        });
        field.appendChild(piece);
      }
      boardElement.appendChild(field);
    });
  });
}

function randomMove() {
  const row = Math.floor(Math.random() * 6);
  const col = Math.floor(Math.random() * 7);
  const values = ["", "r", "b"];
  state.board[row][col] = values[Math.floor(Math.random() * 3)];
  showBoard();
}

document.addEventListener("DOMContentLoaded", () => {
  showBoard();
  setInterval(randomMove, 1000);
});

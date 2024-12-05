import { render, useSJDON } from "./lib/suiweb-1.1.js";
import { App, Board, Field } from "./components.js";

window.state = {
  board: Array(6)
    .fill("")
    .map(() => Array(7).fill("")),
  currentPlayer: "r",
  gameOver: false,
};

window.stateSeq = [];

function setInList(list, idx, val) {
  return [...list.slice(0, idx), val, ...list.slice(idx + 1)];
}

function setInObj(obj, key, val) {
  return { ...obj, [key]: val };
}

useSJDON(Field, Board, App);

function showBoard() {
  const app = document.querySelector(".app");
  app.innerHTML = "";
  render([App], app);

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
      if (
        board[row][col] === player &&
        board[row][col + 1] === player &&
        board[row][col + 2] === player &&
        board[row][col + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check vertical
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        board[row][col] === player &&
        board[row + 1][col] === player &&
        board[row + 2][col] === player &&
        board[row + 3][col] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonals
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      // Diagonal down-right
      if (
        row < 3 &&
        board[row][col] === player &&
        board[row + 1][col + 1] === player &&
        board[row + 2][col + 2] === player &&
        board[row + 3][col + 3] === player
      ) {
        return true;
      }
      // Diagonal up-right (fixed)
      if (
        row > 2 &&
        board[row][col] === player &&
        board[row - 1][col + 1] === player &&
        board[row - 2][col + 2] === player &&
        board[row - 3][col + 3] === player
      ) {
        return true;
      }
    }
  }
  return false;
}

function makeMove(col) {
  if (state.gameOver) {
    resetGame();
    return;
  }

  const row = getLowestEmptyRow(col);
  if (row !== -1) {
    stateSeq.push({ ...state, board: [...state.board.map((row) => [...row])] });

    const newBoard = setInList(
      state.board,
      row,
      setInList(state.board[row], col, state.currentPlayer)
    );

    state = setInObj(
      setInObj(state, "board", newBoard),
      "currentPlayer",
      state.currentPlayer === "r" ? "b" : "r"
    );

    if (connect4Winner(state.currentPlayer === "r" ? "b" : "r", state.board)) {
      state.gameOver = true;
      showBoard();
      document.querySelector(".game-info").textContent = `${
        state.currentPlayer === "b" ? "Rot" : "Blau"
      } hat gewonnen! Klicken zum Neustart`;
      return;
    }
    showBoard();
  }
}

function undo() {
  if (stateSeq.length > 0) {
    state = stateSeq.pop();
    showBoard();
  }
}

function resetGame() {
  window.stateSeq = [];

  state = {
    board: Array(6)
      .fill("")
      .map(() => Array(7).fill("")),
    currentPlayer: "r",
    gameOver: false,
  };

  showBoard();
}

async function saveGame() {
  try {
    await fetch("/api/data/game?api-key=c4game", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(state),
      credentials: "same-origin",
    });
    document.querySelector("#saveServer").disabled = false;
  } catch (e) {
    console.error("Failed to save game to server:", e);
    document.querySelector("#saveServer").disabled = true;
  }
}

function saveGameLocal() {
  try {
    localStorage.setItem("connect4game", JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game to localStorage:", e);
  }
}

async function loadGame() {
  try {
    const response = await fetch("/api/data/game?api-key=c4game", {
      credentials: "same-origin",
    });
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
    const savedState = localStorage.getItem("connect4game");
    if (savedState) {
      state = JSON.parse(savedState);
      showBoard();
    }
  } catch (e) {
    console.error("Failed to load game from localStorage:", e);
  }
}

// Make makeMove available globally for components
window.makeMove = makeMove;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#newGame").addEventListener("click", resetGame);
  document.querySelector("#undo").addEventListener("click", undo);
  document.querySelector("#saveLocal").addEventListener("click", saveGameLocal);
  document.querySelector("#loadLocal").addEventListener("click", loadGameLocal);
  document.querySelector("#saveGame").addEventListener("click", saveGame);
  document.querySelector("#loadGame").addEventListener("click", loadGame);

  // Initial render
  resetGame();

  // Test server connectivity
  fetch("/api/data/game?api-key=c4game", {
    credentials: "same-origin",
  }).catch(() => {
    document.querySelector("#saveGame").disabled = true;
    document.querySelector("#loadGame").disabled = true;
  });
});

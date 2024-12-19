import { useGameState } from "../hooks/useGameState.js";
import { Board } from "./Board.js";

export const App = () => {
  const { state, makeMove, undo, resetGame, handleStorage } = useGameState();

  return [
    "div",
    { className: "container" },
    [Board, { board: state.board, onMove: makeMove }],
    [
      "div",
      { className: "controls" },
      [
        "p",
        { className: `turn ${state.currentPlayer === "r" ? "red" : "blue"}` },
        `${state.currentPlayer === "r" ? "Rot" : "Blau"} ist am Zug`,
      ],
      ["button", { onclick: resetGame }, "Neues Spiel"],
      ["button", { onclick: undo }, "Rückgängig"],
      [
        "button",
        { onclick: () => handleStorage("save", "local") },
        "Lokal speichern",
      ],
      [
        "button",
        { onclick: () => handleStorage("load", "local") },
        "Lokal laden",
      ],
      [
        "button",
        { onclick: () => handleStorage("save", "server"), id: "saveServer" },
        "Server speichern",
      ],
      [
        "button",
        { onclick: () => handleStorage("load", "server"), id: "loadServer" },
        "Server laden",
      ],
    ],
  ];
};

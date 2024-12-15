import { render, useSJDON } from "./lib/suiweb-1.1.js";
import { App } from "./components/App.js";
import { Board } from "./components/Board.js";
import { Field } from "./components/Field.js";

useSJDON(Field, Board, App);

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("body");
  render([App], app);

  // Test server connectivity
  fetch("/api/data/game?api-key=c4game", {
    credentials: "same-origin",
  }).catch(() => {
    document.querySelector("#saveGame").disabled = true;
    document.querySelector("#loadGame").disabled = true;
  });
});

import { useState } from "../lib/suiweb-1.1.js";
import { connect4Winner, setInList } from "../utils/gameLogic.js";
import { handleStorageOp } from "../utils/storage.js";

export const useGameState = () => {
  const initialState = {
    board: Array(6)
      .fill("")
      .map(() => Array(7).fill("")),
    currentPlayer: "r",
    gameOver: false,
  };

  const [state, setState] = useState(initialState);
  const [stateSeq, setStateSeq] = useState([]);

  const getLowestEmptyRow = (col) =>
    state.board.findLastIndex((row) => row[col] === "");

  const handleGameOver = (newState, winner) => {
    setState({ ...newState, gameOver: true });
    setTimeout(() => {
      alert(`${winner} hat gewonnen!`);
      resetGame();
    }, 500);  //does not rerender after winning but probably not necessary?
  };

  const makeMove = (col) => {
    if (state.gameOver) {
      resetGame(); //do we need this if anyway on handleGameOver we reset the game?
      return;  
    }

    const row = getLowestEmptyRow(col);
    if (row === -1) return;

    setStateSeq([
      ...stateSeq,
      { ...state, board: state.board.map((row) => [...row]) },
    ]);

    const newBoard = setInList(
      state.board,
      row,
      setInList(state.board[row], col, state.currentPlayer)
    );

    const newState = {
      board: newBoard,
      currentPlayer: state.currentPlayer === "r" ? "b" : "r",
      gameOver: false,
    };

    if (connect4Winner(state.currentPlayer, newBoard)) {
      handleGameOver(newState, state.currentPlayer === "r" ? "Rot" : "Blau");
      return;
    }

    setState(newState);
  };

  const undo = () => {
    if (stateSeq.length > 0) {
      setState(stateSeq[stateSeq.length - 1]);
      setStateSeq(stateSeq.slice(0, -1));
    }
  };

  const resetGame = () => {
    setState(initialState);
    setStateSeq([]);
  };

  const handleStorage = async (op, type) => {
    if (op === "load") {
      const data = await handleStorageOp(op, type);
      if (data?.state) {
        setState(data.state);
        setStateSeq(data.stateSeq || []);
      }
    } else {
      await handleStorageOp(op, type, state, stateSeq);
    }
  };

  return {
    state,
    makeMove,
    undo,
    resetGame,
    handleStorage,
  };
};

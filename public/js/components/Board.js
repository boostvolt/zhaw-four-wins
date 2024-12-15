import { Field } from './Field.js';

export const Board = ({ board, onMove }) => {
  let flatBoard = [].concat(...board);
  let fields = flatBoard.map((type, index) => [
    Field,
    {
      type,
      col: index % 7,
      key: index,
      onMove,
    },
  ]);
  return ["div", { className: "board" }, ...fields];
};

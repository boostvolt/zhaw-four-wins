export const Field = ({ type, col }) => {
  const props = {
    className: "field",
    "data-col": col,
    onclick: () => window.makeMove(col),
  };

  return type
    ? [
        "div",
        props,
        ["div", { className: `piece ${type === "r" ? "red" : "blue"}` }],
      ]
    : ["div", props];
};

export const Board = ({ board }) => {
  let flatBoard = [].concat(...board);
  let fields = flatBoard.map((type, index) => [
    Field,
    {
      type,
      col: index % 7,
      key: index,
    },
  ]);
  return ["div", { className: "board" }, ...fields];
};

export const App = () => [Board, { board: window.state.board }];

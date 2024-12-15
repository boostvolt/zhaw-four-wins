// components/Field.js
export const Field = ({ type, col, onMove }) => {
  const props = {
    className: "field",
    "data-col": col,
    onclick: () => onMove(col),
  };

  return type
    ? [
        "div",
        props,
        ["div", { className: `piece ${type === "r" ? "red" : "blue"}` }],
      ]
    : ["div", props];
};

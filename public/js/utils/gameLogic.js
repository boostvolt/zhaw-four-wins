export const setInList = (list, idx, val) => [
  ...list.slice(0, idx),
  val,
  ...list.slice(idx + 1),
];

export const connect4Winner = (player, board) => {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down
    [-1, 1], // diagonal up
  ];

  const checkLine = (row, col, [dy, dx]) => {
    for (let i = 0; i < 4; i++) {
      const y = row + dy * i;
      const x = col + dx * i;
      if (y < 0 || y >= 6 || x < 0 || x >= 7 || board[y][x] !== player) {
        return false;
      }
    }
    return true;
  };

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        board[row][col] === player &&
        directions.some((dir) => checkLine(row, col, dir))
      ) {
        return true;
      }
    }
  }

  return false;
};
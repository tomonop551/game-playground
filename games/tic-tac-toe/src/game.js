export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
  [0, 4, 8], [2, 4, 6],            // 斜め
];

// board(9マス)で mark の3目並べがあればそのライン、なければ null
export function judge(board, mark) {
  for (const line of LINES) {
    if (line.every((i) => board[i] === mark)) return line;
  }
  return null;
}

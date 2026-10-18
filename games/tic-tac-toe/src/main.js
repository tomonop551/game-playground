const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
  [0, 4, 8], [2, 4, 6],            // 斜め
];

const state = {
  board: Array(9).fill(null),
  current: "◯",
  finished: false,
};

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetEl = document.getElementById("reset");

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.addEventListener("click", () => play(i));
    boardEl.appendChild(cell);
  }
}

function play(index) {
  if (state.finished || state.board[index]) return;
  state.board[index] = state.current;
  render();
  const line = judge(state.board, state.current);
  if (line) return end(`${state.current} の勝ち!`, line);
  if (state.board.every(Boolean)) return end("引き分け", null);
  state.current = state.current === "◯" ? "×" : "◯";
  statusEl.textContent = `${state.current} の番です`;
}

function judge(board, mark) {
  for (const line of LINES) {
    if (line.every((i) => board[i] === mark)) return line;
  }
  return null;
}

function end(message, line) {
  state.finished = true;
  statusEl.textContent = message;
  if (line) line.forEach((i) => boardEl.children[i].classList.add("win"));
  boardEl.querySelectorAll(".cell").forEach((c) => (c.disabled = true));
}

function render() {
  state.board.forEach((mark, i) => {
    const cell = boardEl.children[i];
    cell.textContent = mark ?? "";
    cell.disabled = Boolean(mark) || state.finished;
  });
}

function reset() {
  state.board = Array(9).fill(null);
  state.current = "◯";
  state.finished = false;
  statusEl.textContent = "◯ の番です";
  boardEl.querySelectorAll(".cell").forEach((c) => {
    c.textContent = "";
    c.disabled = false;
    c.classList.remove("win");
  });
}

createBoard();
resetEl.addEventListener("click", reset);

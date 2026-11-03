import { describe, expect, it } from "vitest";
import { judge, LINES } from "./game.js";

const empty = () => Array(9).fill(null);

describe("judge", () => {
  it("8通りのラインすべてで勝ちを判定する", () => {
    expect(LINES).toHaveLength(8);
    for (const line of LINES) {
      const board = empty();
      for (const i of line) board[i] = "◯";
      expect(judge(board, "◯")).toEqual(line);
    }
  });

  it("2つそろうだけでは null", () => {
    const board = empty();
    board[0] = "×";
    board[1] = "×";
    expect(judge(board, "×")).toBeNull();
  });

  it("相手の3目並べは自分のマークでは勝ちにならない", () => {
    const board = empty();
    board[0] = "◯";
    board[1] = "◯";
    board[2] = "◯";
    expect(judge(board, "×")).toBeNull();
  });

  it("全マスを埋めてもラインがなければ null(引き分け盤面)", () => {
    const board = ["◯", "◯", "×", "×", "×", "◯", "◯", "×", "◯"];
    expect(judge(board, "◯")).toBeNull();
    expect(judge(board, "×")).toBeNull();
  });

  it("空盤面は null", () => {
    expect(judge(empty(), "◯")).toBeNull();
    expect(judge(empty(), "×")).toBeNull();
  });
});

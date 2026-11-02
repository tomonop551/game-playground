import { describe, expect, it } from "vitest";
import { createDeck, judgeGuess, rankLabel } from "./game.js";

const cardKey = (c) => `${c.rank}${c.suit.symbol}`;

describe("rankLabel", () => {
  it("A・J・Q・K はラベルに変換する", () => {
    expect(rankLabel(1)).toBe("A");
    expect(rankLabel(11)).toBe("J");
    expect(rankLabel(12)).toBe("Q");
    expect(rankLabel(13)).toBe("K");
  });

  it("2〜10 はそのまま数値文字列", () => {
    for (let rank = 2; rank <= 10; rank++) {
      expect(rankLabel(rank)).toBe(String(rank));
    }
  });
});

describe("createDeck", () => {
  it("52枚・ランク1〜13×4スートの重複なしトランプができる", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map(cardKey)).size).toBe(52);
    for (const card of deck) {
      expect(card.rank).toBeGreaterThanOrEqual(1);
      expect(card.rank).toBeLessThanOrEqual(13);
      expect(["♠", "♥", "♦", "♣"]).toContain(card.suit.symbol);
    }
  });

  it("乱数を注入すると結果が決定論的になる", () => {
    // rand()=0 固定では swap が常に先頭と行われ、同一入力から同一順列になる
    const a = createDeck(() => 0).map(cardKey);
    const b = createDeck(() => 0).map(cardKey);
    expect(a).toEqual(b);
    expect(new Set(a).size).toBe(52);
  });

  it("シャッフル後も全カードが残っている(欠け・増殖がない)", () => {
    const deck = createDeck(() => 0.5);
    const sorted = deck.map(cardKey).sort();
    const expected = [];
    for (const suit of ["♠", "♥", "♦", "♣"]) {
      for (let rank = 1; rank <= 13; rank++) expected.push(`${rank}${suit}`);
    }
    expect(sorted).toEqual(expected.sort());
  });
});

describe("judgeGuess", () => {
  it("同じランクは High/Low どちらの宣言でも skip", () => {
    expect(judgeGuess(7, 7, "high")).toBe("skip");
    expect(judgeGuess(7, 7, "low")).toBe("skip");
  });

  it("High 宣言: 次のカードが大きければ hit、小さければ miss", () => {
    expect(judgeGuess(5, 6, "high")).toBe("hit");
    expect(judgeGuess(1, 13, "high")).toBe("hit");
    expect(judgeGuess(6, 5, "high")).toBe("miss");
    expect(judgeGuess(13, 1, "high")).toBe("miss");
  });

  it("Low 宣言: 次のカードが小さければ hit、大きければ miss", () => {
    expect(judgeGuess(6, 5, "low")).toBe("hit");
    expect(judgeGuess(13, 1, "low")).toBe("hit");
    expect(judgeGuess(5, 6, "low")).toBe("miss");
    expect(judgeGuess(1, 13, "low")).toBe("miss");
  });
});

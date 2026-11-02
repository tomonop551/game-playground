export const SUITS = [
  { symbol: "♠", color: "black" },
  { symbol: "♥", color: "red" },
  { symbol: "♦", color: "red" },
  { symbol: "♣", color: "black" },
];

export const RANK_LABELS = { 1: "A", 11: "J", 12: "Q", 13: "K" };

export function rankLabel(rank) {
  return RANK_LABELS[rank] ?? String(rank);
}

// rand を注入可能にしたのはテストでシャッフルを決定論化するため(既定は Math.random)
export function createDeck(rand = Math.random) {
  const deck = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) deck.push({ rank, suit });
  }
  // Fisher-Yates シャッフル
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// ハイ&ロー判定: 同じランクは "skip"(スコアに影響なし)、当たり "hit"、それ以外 "miss"
export function judgeGuess(currentRank, nextRank, dir) {
  if (nextRank === currentRank) return "skip";
  const hit = dir === "high" ? nextRank > currentRank : nextRank < currentRank;
  return hit ? "hit" : "miss";
}

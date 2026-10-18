<script>
  import { onMount } from "svelte";

  const SUITS = [
    { symbol: "♠", color: "black" },
    { symbol: "♥", color: "red" },
    { symbol: "♦", color: "red" },
    { symbol: "♣", color: "black" },
  ];
  const RANK_LABELS = { 1: "A", 11: "J", 12: "Q", 13: "K" };
  const BEST_KEY = "high-and-low:best";

  function rankLabel(rank) {
    return RANK_LABELS[rank] ?? String(rank);
  }

  function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (let rank = 1; rank <= 13; rank++) deck.push({ rank, suit });
    }
    // Fisher-Yates シャッフル
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  let deck = $state([]);
  let current = $state(null); // { rank, suit }
  let streak = $state(0);
  let best = $state(0);
  let phase = $state("start"); // "start" | "playing" | "over"
  let message = $state("");

  onMount(() => {
    const saved = Number(localStorage.getItem(BEST_KEY) ?? 0);
    if (saved > best) best = saved;
  });

  function start() {
    deck = createDeck();
    current = deck.pop();
    streak = 0;
    message = "高いか、低いか?";
    phase = "playing";
  }

  function guess(dir) {
    if (phase !== "playing" || !current) return;
    const next = deck.pop();

    if (next.rank === current.rank) {
      // 同じランクはスキップ(スコアに影響なし)
      current = next;
      message = `同じランク(${rankLabel(next.rank)}) — スキップ`;
      return;
    }

    const hit = dir === "high" ? next.rank > current.rank : next.rank < current.rank;
    if (hit) {
      streak += 1;
      if (streak > best) {
        best = streak;
        localStorage.setItem(BEST_KEY, String(best));
      }
      message = `当たり!(${rankLabel(current.rank)} → ${rankLabel(next.rank)})`;
      current = next;
    } else {
      message = `はずれ — ${rankLabel(current.rank)} → ${rankLabel(next.rank)}`;
      phase = "over";
    }
  }
</script>

<main>
  <h1>High & Low</h1>
  <p class="message">{message}</p>

  {#if phase === "start"}
    <div class="panel">
      <p>山札から1枚引いたカードより、次のカードが「高い」か「低い」かを当ててください。</p>
      <p>当たり続ければ連続記録が伸びます。同じランクはスキップです。</p>
      <button class="primary" onclick={start}>スタート</button>
    </div>
  {:else}
    <div class="table">
      <div class="card {current.suit.color}">
        <span class="rank">{rankLabel(current.rank)}</span>
        <span class="suit">{current.suit.symbol}</span>
      </div>

      {#if phase === "playing"}
        <div class="actions">
          <button class="primary" onclick={() => guess("high")}>▲ High</button>
          <button class="primary" onclick={() => guess("low")}>▼ Low</button>
        </div>
      {:else}
        <div class="actions">
          <button class="primary" onclick={start}>もう一度遊ぶ</button>
        </div>
      {/if}

      <div class="scores">
        <span>連続: {streak}</span>
        <span>最高: {best}</span>
        <span>残り: {deck.length}</span>
      </div>
    </div>
  {/if}

  <p><a href="../../">← ポータルへ戻る</a></p>
</main>

<style>
  :global(body) {
    background: #0f1117;
    color: #e6e8ee;
    font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    margin: 0;
  }
  main {
    max-width: 420px;
    margin: 0 auto;
    padding: 3rem 1rem;
    text-align: center;
  }
  h1 { font-size: 1.75rem; margin-bottom: 0.75rem; }
  .message { color: #8b93a7; min-height: 1.5rem; margin-bottom: 1.25rem; }
  .panel { font-size: 0.95rem; color: #8b93a7; display: grid; gap: 0.75rem; }
  .table { display: grid; gap: 1.25rem; justify-items: center; }
  .card {
    width: 140px;
    height: 200px;
    background: #1a1e2a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .card .rank { font-size: 3.5rem; font-weight: bold; }
  .card .suit { font-size: 2rem; }
  .card.black { color: #e6e8ee; }
  .card.red { color: #ff6b81; }
  .actions { display: flex; gap: 1rem; }
  .scores {
    display: flex;
    gap: 1.5rem;
    color: #8b93a7;
    font-size: 0.9rem;
  }
  button {
    padding: 0.6rem 1.75rem;
    font-size: 0.95rem;
    color: #0f1117;
    background: #6c8cff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  button:hover { background: #8aa4ff; }
  a { color: #6c8cff; text-decoration: none; font-size: 0.85rem; }
</style>

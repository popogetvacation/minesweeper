<script setup lang="ts">
// import { BlockState } from "~/types";
import { isDev } from "../composables";
import { GamePlay } from "../composables/logic";

const play = new GamePlay(12, 12, 2);
useStorage("vuesweeper-state", play.state);
watchEffect(() => {
  play.checkGameState();
});
const state = computed(() => play.board);
const minescount = computed(() => {
  return play.board.flat().reduce((a = 0, b) => a + (b.mine ? 1 : 0), 0);
});
function newGame(difficulty: "easy" | "medium" | "hard") {
  switch (difficulty) {
    case "easy":
      return play.reset(9, 9, 10);
    case "medium":
      return play.reset(16, 16, 40);
    case "hard":
      return play.reset(30, 16, 99);
  }
}
</script>

<template>
  <div>
    Minesweeper
    <div flex="~ gap1" justify-center>
      <button btn @click="play.reset()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>
    <div p5 id="windows" w-auto overflow-auto>
      <div
        v-for="(row, y) in state"
        :key="y"
        flex="~"
        items-center
        justify-center
        w-max
        ma
      >
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onClickRight(block)"
        ></MineBlock>
      </div>
      <div>count:{{ minescount }}</div>
      <div flex="~" justify-center>
        <button btn @click="isDev = ~isDev">
          {{ isDev ? "DEV" : "NORMAL" }}
        </button>
        
      </div>
      <Confetti :passed="play.state.value.gameState === 'won'" />
    </div>
  </div>
</template>

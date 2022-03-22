<script setup lang="ts">
// import { BlockState } from "~/types";
import { isDev } from "../composables";
import { GamePlay } from "../composables/logic";
const nowTime = $(useNow());
const timerMS = $computed(() =>
  Math.round((+nowTime - play.state.value.startMS) / 1000)
);
const minmeRest = $computed(() => {
  if (!play.state.value.mineGenerated) return play.mines;
  return play.board
    .flat()
    .reduce((a, b) => a + (b.mine && !b.flagged ? 1 : 0), 0);
});
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
    <div flex="~ gap1" justify-center p4>
      <button btn @click="play.reset()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>
    <div flex="~ gap-10" justify-center>
      <div font-mono text-2xl flex="~" justify-center><div i-carbon-timer></div>time:{{timerMS}}</div>
      <div font-mono text-2xl flex="~" justify-center ><div i-mdi-mine></div>mines:{{minmeRest}}</div>
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
          @dblclick="play.autoExpand(block)"
          @contextmenu.prevent="play.onClickRight(block)"
        ></MineBlock>
      </div>
      
      
      <Confetti :passed="play.state.value.gameState === 'won'" />
    </div>
  </div>
</template>

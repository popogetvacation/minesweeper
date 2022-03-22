<script setup lang="ts">
// import { BlockState } from "~/types";
import { isDev } from "../composables";
import { GamePlay } from "../composables/logic";

const play = new GamePlay(12, 12,50);
useStorage('vuesweeper-state',play.state)
watchEffect(()=>{
  play.checkGameState()
})
const state =computed(()=>play.board)
const minescount = computed(()=>{
  return play.board.flat().reduce((a=0,b)=>a+(b.mine?1:0),0)
})
</script>

<template>
  <div>
    Minesweeper

    <div p5 id="windows">
      <div
        v-for="(row, y) in state"
        :key="y"
        flex="~"
        items-center
        justify-center
      >
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onClickRight(block)"
        ></MineBlock>
      </div>
      <div>count:{{minescount}}</div>
      <div flex="~" justify-center>
        <button btn @click="isDev = ~isDev">
          {{ isDev ? 'DEV' : 'NORMAL' }}
        </button>
        <button btn @click="play.reset()">
          RESET
        </button>
      </div>
    </div>
  </div>
</template>

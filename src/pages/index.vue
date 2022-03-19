<script setup lang="ts">
interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}

const HEIGHT = 15;
const WIDTH = 15;

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, 1],
  [1, -1],
  [1, 0],
];

const numberColors = [
  "test-transparent",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-purple-500",
  "text-pink-500",
];

const state = reactive(
  Array.apply(null, new Array(HEIGHT)).map((_, y) => {
    return Array.apply(null, new Array(WIDTH)).map((_, x): BlockState => {
      return { x, y, adjacentMines: 0, revealed: false };
    });
  })
);

function getBlockClass(block: BlockState) {
  return !block.revealed
    ? "bg-gray-500/10"
    : block.mine
    ? "bg-red-500/20"
    : numberColors[block.adjacentMines];
}

function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) < 1) continue;
      if (Math.abs(initial.y - block.y) < 1) continue;
      block.mine = Math.random() < 0.21;
    }
  }
  updateNumbers();
}

function expendZero(block: BlockState) {
  console.log(block);
  if (block.adjacentMines != 0) return;
  block.revealed = true;
  getSiblings(block).forEach((x) => {
    if (x.revealed) return;
    x.revealed = true;
    expendZero(x);
  });
}

let mineGenerated = false;
let dev = false;

function onClick(block: BlockState) {
  if(block.flagged) return
  if (!mineGenerated) {
    generateMines(block);
    mineGenerated = true;
  }
  if (block.adjacentMines === 0) expendZero(block);
  else block.revealed = true;
  if (block.mine) alert("BOOOOM!!!");
}

function onClickRight(block: BlockState) {

  if(!block.flagged) block.flagged = true
  else block.flagged = false
}

function updateNumbers() {
  state.forEach((raw, y) => {
    raw.forEach((block, x) => {
      if (block.mine) return;
      getSiblings(block).forEach((b) => {
        if (b.mine) block.adjacentMines += 1;
      });
    });
  });
}

function getSiblings(block: BlockState) {
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) {
        return undefined;
      }
      return state[y2][x2];
    })
    .filter(Boolean) as BlockState[];
}
console.log(document.getElementById("windows"));
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
        <button
          v-for="(block, x) in row"
          :key="x"
          w-10
          h-10
          border="1 gray-400/30"
          flex="~"
          items-center
          justify-center
          :class="getBlockClass(block)"
          hover="bg-gray/20"
          @click="onClick(block)"
          @contextmenu.prevent="onClickRight(block)"
        >
          <template v-if="block.flagged&&!block.revealed">
            <div >
              🚩
            </div>
          </template>
          <template v-if="(block.revealed || dev)">
            <div v-if="block.mine" i-mdi-mine></div>
            <div v-else>
              {{ block.adjacentMines ? block.adjacentMines : "" }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

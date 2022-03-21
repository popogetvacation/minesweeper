<script setup lang="ts">
import { BlockState } from "~/types";
import {isDev} from "../composables"
defineProps < { block:BlockState }>()

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

function getBlockClass(block: BlockState) {
  if (block.flagged) return "bg-gray-500/10";
  if (!block.revealed) return "bg-gray-500/10 hover:bg-gray/20";
  return block.mine ? "bg-red-500/50" : numberColors[block.adjacentMines];
}
</script>

<template>
  <button
    
    w-10
    h-10
    border="1 gray-400/30"
    flex="~"
    items-center
    justify-center
    :class="getBlockClass(block)"
    
  >
    <template v-if="block.flagged && !block.revealed">
      <div>🚩</div>
    </template>
    <template v-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine></div>
      <div v-else>
        {{ block.adjacentMines ? block.adjacentMines : "" }}
      </div>
    </template>
  </button>
</template>

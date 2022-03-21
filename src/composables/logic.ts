import { BlockState } from "~/types";
import { Ref } from 'vue'
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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'won' | 'lost'
}

export class GamePlay {
  // mineGenerated = false;
  // GameState = ref<'play' | 'won' | 'lost'>('play')
  // state = ref() as Ref<BlockState[][]>
  state = ref() as Ref<GameState>
  constructor(public width: number, public height: number) {

    this.reset()
  }

  get board(){
    return this.state.value.board
  }
  get gameState(){
    return this.state.value.gameState
  }
  get mineGenerated(){
    return this.state.value.mineGenerated
  }

  reset() {
    //   this.state.value = Array.apply(this.state.value, new Array(this.height).map((_, y):BlockState[] => {
    //     return Array.apply(null, new Array(this.width)).map((_, x): BlockState => {
    //       return { x, y, adjacentMines: 0, revealed: false };
    //     });
    //   })
    // );
    this.state.value = {
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width },
          (_, x): BlockState => ({
            x, y, adjacentMines: 0, revealed: false
          }),
        )
      ),
      mineGenerated: false,
      gameState: 'play'
    }
    console.log(this.state.value.board)
  }


  generateMines(initial: BlockState) {
    for (const row of this.state.value.board) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) < 1) continue;
        if (Math.abs(initial.y - block.y) < 1) continue;
        block.mine = Math.random() < 0.05;
      }
    }
    this.updateNumbers();
  }

  expendZero(block: BlockState) {
    console.log(block);
    if (block.adjacentMines != 0) return;
    block.revealed = true;
    this.getSiblings(block).forEach((x) => {
      if (x.revealed) return;
      x.revealed = true;
      this.expendZero(x);
    });
  }


  // let dev = false;

  onClick(block: BlockState) {
    if (block.flagged || this.state.value.gameState!== 'play') return;
    if (!this.state.value.mineGenerated) {
      this.generateMines(block);
      this.state.value.mineGenerated = true;
    }
    if (block.adjacentMines === 0) this.expendZero(block);
    else block.revealed = true;
    if (block.mine) {
      alert("BOOOOM!!!");
      this.showAllMine()
      this.state.value.gameState = 'lost'
      return
    }
  }

  onClickRight(block: BlockState) {
    if (block.revealed || this.state.value.gameState !== 'play') return;
    block.flagged = !block.flagged;
  }

  showAllMine() {
    this.state.value.board.flat().forEach(block => {
      if (block.mine) block.revealed = true
    })
  }

  updateNumbers() {
    this.state.value.board.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine) return;
        this.getSiblings(block).forEach((b) => {
          if (b.mine) block.adjacentMines += 1;
        });
      });
    });
  }

  getSiblings(block: BlockState) {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) {
          return undefined;
        }
        return this.state.value.board[y2][x2];
      })
      .filter(Boolean) as BlockState[];
  }



  checkGameState() {
    // if(!mineGenerated) return;.

    const blocks = this.state.value.board.flat();
    if (blocks.every((block) => block.revealed || block.flagged)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        alert("You cheat");
      } else {
        alert("You win!");
        this.state.value.gameState = "won"
      }
    }
  }
}

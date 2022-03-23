import { BlockState } from "~/types";
import { Ref } from 'vue';


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
type gameStatus = 'play' | 'won' | 'lost'
interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: gameStatus
  startMS: number
  endMS?:number
}

export class GamePlay {
  // mineGenerated = false;
  // GameState = ref<'play' | 'won' | 'lost'>('play')
  // state = ref() as Ref<BlockState[][]>
  state = ref() as Ref<GameState>
  constructor(public width: number, public height: number, public mines: number) {

    this.reset()
  }

  get board() {
    return this.state.value.board
  }
  get gameState() {
    return this.state.value.gameState
  }
  get mineGenerated() {
    return this.state.value.mineGenerated
  }

  reset(width = this.width, height = this.height, mines = this.mines) {
    //   this.state.value = Array.apply(this.state.value, new Array(this.height).map((_, y):BlockState[] => {
    //     return Array.apply(null, new Array(this.width)).map((_, x): BlockState => {
    //       return { x, y, adjacentMines: 0, revealed: false };
    //     });
    //   })
    // );
    this.width = width
    this.height = height
    this.mines = mines
    this.state.value = {
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width },
          (_, x): BlockState => ({
            x, y, adjacentMines: 0, revealed: false
          }),
        )
      ),
      mineGenerated: false,
      gameState: 'play',
      startMS: +Date.now(),
    }

  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  randomInt(min: number, max: number) {
    return Math.round(this.random(min, max))
  }



  generateMines(initial: BlockState) {
    const placeRandom = () => {
      const x = this.randomInt(0, this.width - 1)
      const y = this.randomInt(0, this.height - 1)
      const block = this.state.value.board[y][x]
      if (block.mine) return false
      if (Math.abs(initial.x - block.x) < 1) return false;
      if (Math.abs(initial.y - block.y) < 1) return false;
      block.mine = true
      return true
    }
    Array.from({ length: this.mines }, () => null).forEach(() => {
      let place = false
      while (!place) {
        place = placeRandom()
      }
    })
    // for (const row of this.state.value.board) {
    //   for (const block of row) {
    //     if (Math.abs(initial.x - block.x) < 1) continue;
    //     if (Math.abs(initial.y - block.y) < 1) continue;
    //     block.mine = Math.random() < 0.05;
    //   }
    // }
    this.updateNumbers();
  }

  expendZero(block: BlockState) {

    if (block.adjacentMines != 0) return;
    block.revealed = true;
    this.getSiblings(block).forEach((x) => {
      if (x.revealed) return;
      x.revealed = true;
      this.expendZero(x);
    });
  }



  isMine(block:BlockState){
    if (block.mine) {
      this.gameOver('lost')
      return
    }

  }
  onClick(block: BlockState) {
    if (block.flagged || this.state.value.gameState !== 'play') return;
    if (!this.state.value.mineGenerated) {
      this.generateMines(block);
      this.state.value.mineGenerated = true;
    }
    if (block.adjacentMines === 0) this.expendZero(block);
    else block.revealed = true;
    this.isMine(block)
  }

  onClickRight(block: BlockState) {
    if (block.revealed || this.state.value.gameState !== 'play') return;
    block.flagged = !block.flagged;
  }

  autoExpand(block: BlockState) {
    const slibling = this.getSiblings(block)
    const flags = slibling.reduce((a, b) => a + (b.flagged ? 1 : 0), 0)
    if (flags === block.adjacentMines) {
      slibling.forEach((x) => {
        if (!x.flagged && !x.revealed){
          x.revealed = true
          this.isMine(x)
          this.expendZero(x)
        }
          
      })
    }


  }

  showAllMine() {
    this.state.value.board.flat().forEach((block:BlockState) => {
      if (block.mine) block.revealed = true
    })
  }

  updateNumbers() {
    this.state.value.board.forEach((raw:BlockState[]) => {
      raw.forEach((block:BlockState) => {
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
    if (blocks.every((block:BlockState) => block.revealed || block.flagged)) {
      if (blocks.some((block:BlockState) => block.flagged && !block.mine)) {
        alert('Double check!!not Win!!')
      } else {
        // alert("You win!");
        this.gameOver("won")
      }
    }
  }
  
  gameOver(status:gameStatus){
    this.state.value.gameState = status
    this.state.value.endMS = +Date.now()

    if(status==='lost'){
      setTimeout(()=>{
        alert("BOOOOM!!!YOU LOST!!!");
      },0)
      this.showAllMine()
    }

  }
}

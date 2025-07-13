export const BOARD = {
  SIZE: {
    MIN: 5,
    MAX: 19,
    DEFAULT: 5,
  },
}

export const PLAYER = {
  BLACK: 'black',
  WHITE: 'white',
} as const

export const STONE = {
  EMPTY: 0,
  BLACK: 1,
  WHITE: 2,
} as const

export const GAME_STATUS = {
  PLAYING: 'playing',
  FINISHED: 'finished',
} as const

export const GAME_END_TYPE = {
  SCORE: 'score',
  RESIGNATION: 'resignation',
} as const

import { GAME_END_TYPE, GAME_STATUS, PLAYER, STONE } from '@/constants/go'
import { setupFormSchema } from '@/schema/go/setup'
import { z } from 'zod'

export type Player = (typeof PLAYER)[keyof typeof PLAYER]
export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]
export type GameEndType = (typeof GAME_END_TYPE)[keyof typeof GAME_END_TYPE]
export type Stone = (typeof STONE)[keyof typeof STONE]
export type stoneColorClassType = 'bg-black' | 'bg-white' | 'bg-transparent'

export interface GameSettingsProps {
  boardSize: number
  handleBoardSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface GoBoardProps {
  goBoard: Stone[][]
  handleCellClick: (rowIndex: number, colIndex: number) => void
}

export interface GoBoardStoneProps {
  stoneColorClass: stoneColorClassType
}

export interface GoCellProps {
  cell: Stone
  onClick: () => void
}

export interface GameInfoProps {
  currentPlayer: Player
  blackCaptured: number
  whiteCaptured: number
  passCount: number
  gameStatus: GameStatus
  komi: number
  handlePass: () => void
  handleResignation: () => void
  resetGame: () => void
}

export interface GameResult {
  winner: Player
  blackScore: number
  whiteScore: number
  scoreDifference: number
  blackTerritory: number
  whiteTerritory: number
  endType: GameEndType
}

export type SetupFormData = z.infer<typeof setupFormSchema>

export type PlayerType = 'person' | string

export interface PlayerConfig {
  type: PlayerType
  isAI: boolean
  aiProvider?: string
  aiModel?: string
}

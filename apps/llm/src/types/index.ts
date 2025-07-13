export type Player = 'black' | 'white'

export type stoneColorClassType = 'bg-black' | 'bg-white' | 'bg-transparent'

export interface GameSettingsProps {
  boardSize: number
  handleBoardSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface GoBoardProps {
  goBoard: number[][]
  handleCellClick: (rowIndex: number, colIndex: number) => void
}

export interface GoBoardStoneProps {
  stoneColorClass: stoneColorClassType
}

export interface GoCellProps {
  cell: number
  onClick: () => void
}

export interface GameInfoProps {
  currentPlayer: Player
  blackCaptured: number
  whiteCaptured: number
  passCount: number
}

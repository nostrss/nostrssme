import { BOARD } from '@/app/constants/go'

export type Player = 'black' | 'white'

export type stoneColorClassType = 'bg-black' | 'bg-white' | 'bg-transparent'

export interface GoBoardStoneProps {
  stoneColorClass: stoneColorClassType
}

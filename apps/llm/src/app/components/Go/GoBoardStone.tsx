import { GoBoardStoneProps } from '@/app/types'

export default function GoBoardStone({ stoneColorClass }: GoBoardStoneProps) {
  return (
    <div
      className={`relative z-10 rounded-full shadow-md ${stoneColorClass}`}
      style={{ width: '80%', height: '80%' }}
    />
  )
}

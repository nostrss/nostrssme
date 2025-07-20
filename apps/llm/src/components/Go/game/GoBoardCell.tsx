import {
  GoBoardRowLine,
  GoBoardVerticalLine,
} from '@/components/Go/game/GoBoardLine'
import GoBoardStone from '@/components/Go/game/GoBoardStone'
import { GoCellProps, Stone } from '@/types'
import { STONE } from '@/constants/go'

const GoCell = ({ cell, onClick }: GoCellProps) => {
  const handleStoneClass = (cell: Stone) => {
    switch (cell) {
      case STONE.EMPTY:
        return 'bg-transparent'
      case STONE.BLACK:
        return 'bg-black'
      case STONE.WHITE:
        return 'bg-white'
      default:
        return 'bg-transparent'
    }
  }

  return (
    <div
      className='relative flex-1 flex justify-center items-center cursor-pointer'
      onClick={onClick}
      role='button'
      aria-label='Go board cell'
    >
      <GoBoardRowLine />
      <GoBoardVerticalLine />
      {cell !== STONE.EMPTY && (
        <GoBoardStone stoneColorClass={handleStoneClass(cell)} />
      )}
    </div>
  )
}

export default GoCell

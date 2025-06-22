import {
  GoBoardRowLine,
  GoBoardVerticalLine,
} from '@/components/Go/GoBoardLine'
import GoBoardStone from '@/components/Go/GoBoardStone'
import { GoCellProps } from '@/types'

const GoCell = ({ cell, onClick }: GoCellProps) => {
  const handleStoneClass = (cell: number) => {
    switch (cell) {
      case 0:
        return 'bg-transparent'
      case 1:
        return 'bg-black'
      case 2:
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
      {cell !== 0 && <GoBoardStone stoneColorClass={handleStoneClass(cell)} />}
    </div>
  )
}

export default GoCell

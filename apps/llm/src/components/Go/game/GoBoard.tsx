import GoBoardCell from '@/components/Go/game/GoBoardCell'
import { GoBoardProps } from '@/types'

export default function GoBoard({ goBoard, handleCellClick }: GoBoardProps) {
  return (
    <div className='flex flex-1 flex-col bg-amber-200 p-2 md:p-4 rounded-lg shadow-lg max-w-full max-h-full mx-auto aspect-square'>
      {goBoard.map((row, rowIndex) => (
        <div key={rowIndex} className='flex flex-1'>
          {row.map((cell, colIndex) => (
            <GoBoardCell
              key={colIndex}
              cell={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

import GoBoardCell from '@/app/components/Go/GoBoardCell'
import { GoBoardProps } from '@/app/types'

export default function GoBoard({ goBoard, handleCellClick }: GoBoardProps) {
  return (
    <div className='flex flex-col bg-amber-200 p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-xl lg:max-w-3xl aspect-square'>
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

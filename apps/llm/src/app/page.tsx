'use client'
import { useState } from 'react'
import { create2DArray } from '@repo/utils'
import GoCell from '@/app/components/GoCell'

export default function Home() {
  const [goBoard, setGoBoard] = useState(create2DArray(2, 3, 0))

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    console.log(`Clicked at coordinates: [${rowIndex}, ${colIndex}]`)

    setGoBoard(prevBoard =>
      prevBoard.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) => (cIndex === colIndex ? 1 : cell))
          : row
      )
    )
  }

  return (
    <div
      data-testid='go-board'
      className='flex justify-center items-center min-h-screen bg-amber-50'
    >
      <div className='flex flex-col gap-0 bg-amber-200 p-4 rounded-lg shadow-lg'>
        {goBoard.map((row, rowIndex) => (
          <div key={rowIndex} className='flex gap-0'>
            {row.map((cell, colIndex) => (
              <GoCell
                key={colIndex}
                cell={cell}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

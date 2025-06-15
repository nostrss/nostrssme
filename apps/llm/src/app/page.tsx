import { create2DArray } from '@repo/utils'

export default function Home() {
  const goBoard = create2DArray(19, 19, 0)

  return (
    <div
      data-testid='go-board'
      className='flex justify-center items-center min-h-screen bg-amber-50'
    >
      <div className='grid grid-cols-19 gap-0 bg-amber-200 p-4 rounded-lg shadow-lg'>
        {goBoard.map((row, rowIndex) => (
          <div key={rowIndex} className='flex flex-col'>
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                data-testid='go-cell'
                className='w-8 h-8 border border-gray-400 flex items-center justify-center relative'
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

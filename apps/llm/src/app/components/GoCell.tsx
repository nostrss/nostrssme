import React from 'react'

interface GoCellProps {
  cell: number // 0: empty, 1: black, 2: white
  onClick: () => void
}

const GoCell: React.FC<GoCellProps> = ({ cell, onClick }) => {
  const stoneColor =
    cell === 1 ? 'bg-black' : cell === 2 ? 'bg-white' : 'bg-transparent'

  return (
    <div
      className='relative flex-1 flex justify-center items-center cursor-pointer' // flex-1로 셀이 공간을 균등하게 차지하도록 함
      onClick={onClick}
      role='button'
      aria-label='Go board cell'
    >
      {/* 바둑판 선 (가로, 세로) */}
      <div className='absolute top-1/2 left-0 w-full h-[1px] bg-stone-600 -translate-y-1/2'></div>{' '}
      {/* 1px 두께의 가로선 */}
      <div className='absolute top-0 left-1/2 w-[1px] h-full bg-stone-600 -translate-x-1/2'></div>{' '}
      {/* 1px 두께의 세로선 */}
      {/* 바둑돌 */}
      {cell !== 0 && (
        <div
          className={`relative z-10 rounded-full shadow-md ${stoneColor}`}
          style={{ width: '80%', height: '80%' }}
        ></div>
      )}
    </div>
  )
}

export default GoCell

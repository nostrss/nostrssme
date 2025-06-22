'use client'
import { useState, useEffect } from 'react'
import { create2DArray } from '@repo/utils' // Assuming @repo/utils is available and contains create2DArray
import GoCell from '@/app/components/GoCell'

// 플레이어 타입을 정의하여 가독성을 높입니다.
type Player = 'black' | 'white'
const PLAYER_STONE_MAP: Record<Player, number> = {
  black: 1,
  white: 2,
}
const MIN_BOARD_SIZE = 5
const MAX_BOARD_SIZE = 19
const DEFAULT_BOARD_SIZE = 19 // Default board size

export default function Home() {
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE) // State for board size
  const [goBoard, setGoBoard] = useState(() =>
    create2DArray(DEFAULT_BOARD_SIZE, DEFAULT_BOARD_SIZE, 0)
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black')

  // boardSize가 변경될 때마다 바둑판과 현재 플레이어를 초기화합니다.
  useEffect(() => {
    setGoBoard(create2DArray(boardSize, boardSize, 0))
    setCurrentPlayer('black')
  }, [boardSize])

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // 이미 돌이 놓인 곳에는 둘 수 없습니다.
    if (goBoard[rowIndex]![colIndex] !== 0) {
      console.log('이곳에는 이미 돌이 놓여있습니다.')
      return
    }

    setGoBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]) // 상태 불변성을 위해 깊은 복사
      newBoard[rowIndex]![colIndex] = PLAYER_STONE_MAP[currentPlayer]
      // TODO: 돌을 따내는 로직(따먹기)을 여기에 추가해야 합니다.
      return newBoard
    })

    // 다음 플레이어로 턴을 넘깁니다.
    setCurrentPlayer(prevPlayer => (prevPlayer === 'black' ? 'white' : 'black'))
  }

  const handleBoardSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value, 10)
    setBoardSize(newSize)
    // useEffect 훅이 boardSize 변경을 감지하여 바둑판과 플레이어를 초기화합니다.
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-amber-50 p-4 md:p-8 lg:p-12'>
      <h1 className='text-2xl font-bold mb-4 md:text-3xl'>바둑</h1>

      <div className='mb-4 flex items-center'>
        <label
          htmlFor='board-size-select'
          className='mr-2 text-base md:text-lg'
        >
          바둑판 크기:
        </label>
        <select
          id='board-size-select'
          value={boardSize}
          onChange={handleBoardSizeChange}
          className='p-2 border rounded-md bg-white text-base md:text-lg'
        >
          {Array.from(
            { length: MAX_BOARD_SIZE - MIN_BOARD_SIZE + 1 },
            (_, i) => MIN_BOARD_SIZE + i
          ).map(size => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>
      </div>

      <p className='text-base mb-6 md:text-lg'>
        현재 차례:{' '}
        <span className='font-bold'>
          {currentPlayer === 'black' ? '흑' : '백'}
        </span>
      </p>
      {/* 바둑판 컨테이너: 반응형 최대 너비와 정사각형 비율을 유지합니다. */}
      <div className='flex flex-col bg-amber-200 p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-xl lg:max-w-3xl aspect-square'>
        {goBoard.map((row, rowIndex) => (
          <div key={rowIndex} className='flex flex-1'>
            {' '}
            {/* 각 행이 높이를 균등하게 차지하도록 flex-1 적용 */}
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

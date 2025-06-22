'use client'
import { useState, useEffect } from 'react'
import { create2DArray } from '@repo/utils'
import GoBoardCell from '@/app/components/Go/GoBoardCell'
import GoBoardSettings from '@/app/components/Go/GoBoardSettings'
import { Player } from '@/app/types'
import { BOARD } from '@/app/constants/go'

export default function Home() {
  const [boardSize, setBoardSize] = useState(BOARD.SIZE.DEFAULT)
  const [goBoard, setGoBoard] = useState(() =>
    create2DArray(BOARD.SIZE.DEFAULT, BOARD.SIZE.DEFAULT, 0)
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black')

  const getPlayerStoneValue = (currentPlayer: Player) => {
    return currentPlayer === 'black' ? 1 : 2
  }

  useEffect(() => {
    setGoBoard(create2DArray(boardSize, boardSize, 0))
    setCurrentPlayer('black')
  }, [boardSize])

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (goBoard[rowIndex]![colIndex] !== 0) {
      console.log('이곳에는 이미 돌이 놓여있습니다.')
      return
    }

    setGoBoard(prevBoard => {
      // 상태 불변성을 위해 깊은 복사
      const newBoard = prevBoard.map(row => [...row])
      newBoard[rowIndex]![colIndex] = getPlayerStoneValue(currentPlayer)
      // TODO: 돌을 따내는 로직(따먹기)을 여기에 추가해야 합니다.
      return newBoard
    })

    setCurrentPlayer(prevPlayer => (prevPlayer === 'black' ? 'white' : 'black'))
  }

  const handleBoardSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value, 10)
    setBoardSize(newSize)
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-amber-50 p-4 md:p-8 lg:p-12'>
      <GoBoardSettings
        boardSize={boardSize}
        handleBoardSizeChange={handleBoardSizeChange}
        currentPlayer={currentPlayer}
      />
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
    </div>
  )
}

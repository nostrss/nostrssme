'use client'
import { useState, useEffect } from 'react'
import { create2DArray } from '@repo/utils'
import GameSettings from '@/components/Go/GameSettings'
import GoBoard from '@/components/Go/GoBoard'
import { Player } from '@/types'
import { BOARD } from '@/constants/go'
import { getGroupInfo, getNeighbors } from '@/utils/go'

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

    const newBoard = goBoard.map(row => [...row])
    const playerStoneValue = getPlayerStoneValue(currentPlayer)
    newBoard[rowIndex]![colIndex] = playerStoneValue

    const opponentStoneValue = playerStoneValue === 1 ? 2 : 1
    let capturedStones: [number, number][] = []

    for (const [r, c] of getNeighbors(rowIndex, colIndex, boardSize)) {
      if (r == null || c == null) {
        continue
      }

      if (newBoard[r]?.[c] === opponentStoneValue) {
        const { stones, liberties } = getGroupInfo(r, c, newBoard)
        if (liberties === 0) {
          capturedStones = capturedStones.concat(stones)
        }
      }
    }

    capturedStones.forEach(([r, c]) => (newBoard[r]![c] = 0))

    const { liberties: ownLiberties } = getGroupInfo(
      rowIndex,
      colIndex,
      newBoard
    )
    if (ownLiberties === 0 && capturedStones.length === 0) {
      console.log('자살수는 둘 수 없습니다.')
      return
    }

    setGoBoard(newBoard)
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
      <GameSettings
        boardSize={boardSize}
        handleBoardSizeChange={handleBoardSizeChange}
        currentPlayer={currentPlayer}
      />
      <GoBoard goBoard={goBoard} handleCellClick={handleCellClick} />
    </div>
  )
}

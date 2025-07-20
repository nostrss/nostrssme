'use client'
import { useState, useEffect } from 'react'
import { create2DArray } from '@repo/utils'
import GoBoard from '@/components/Go/game/GoBoard'
import { GameResult, GameStatus, Player, Stone } from '@/types'
import {
  BOARD,
  PLAYER,
  GAME_STATUS,
  GAME_END_TYPE,
  STONE,
} from '@/constants/go'
import { getGroupInfo, getNeighbors, calculateScore } from '@/utils/go'
import GameInfo from '@/components/Go/game/GameInfo'
import FinishedInfo from '@/components/Go/game/FinishedInfo'

export default function Home() {
  const [boardSize, setBoardSize] = useState(BOARD.SIZE.DEFAULT)
  const [goBoard, setGoBoard] = useState<Stone[][]>(() =>
    create2DArray(BOARD.SIZE.DEFAULT, BOARD.SIZE.DEFAULT, STONE.EMPTY)
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER.BLACK)
  const [blackCaptured, setBlackCaptured] = useState(0)
  const [whiteCaptured, setWhiteCaptured] = useState(0)
  const [passCount, setPassCount] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.PLAYING)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)

  const getPlayerStone = (currentPlayer: Player): Stone => {
    return currentPlayer === PLAYER.BLACK ? STONE.BLACK : STONE.WHITE
  }

  const resetGame = () => {
    setGoBoard(create2DArray(boardSize, boardSize, STONE.EMPTY))
    setCurrentPlayer(PLAYER.BLACK)
    setBlackCaptured(0)
    setWhiteCaptured(0)
    setPassCount(0)
    setGameStatus(GAME_STATUS.PLAYING)
    setGameResult(null)
  }

  useEffect(() => {
    resetGame()
  }, [boardSize])

  const handlePass = () => {
    if (gameStatus !== GAME_STATUS.PLAYING) return

    const newPassCount = passCount + 1
    setPassCount(newPassCount)

    if (newPassCount >= 2) {
      // 게임 종료 - 점수 계산
      const result = calculateScore(goBoard, blackCaptured, whiteCaptured)
      setGameResult({
        ...result,
        endType: GAME_END_TYPE.SCORE,
      })
      setGameStatus(GAME_STATUS.FINISHED)
      return
    }

    setCurrentPlayer(prevPlayer =>
      prevPlayer === PLAYER.BLACK ? PLAYER.WHITE : PLAYER.BLACK
    )
  }

  const handleResignation = () => {
    if (gameStatus !== GAME_STATUS.PLAYING) return

    const winner = currentPlayer === PLAYER.BLACK ? PLAYER.WHITE : PLAYER.BLACK

    // 기권 시에는 점수 계산 없이 상대방 승리
    setGameResult({
      winner,
      blackScore: 0,
      whiteScore: 0,
      scoreDifference: 0,
      blackTerritory: 0,
      whiteTerritory: 0,
      endType: GAME_END_TYPE.RESIGNATION,
    })
    setGameStatus(GAME_STATUS.FINISHED)
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (gameStatus !== GAME_STATUS.PLAYING) return

    if (goBoard[rowIndex]![colIndex] !== STONE.EMPTY) {
      console.log('이곳에는 이미 돌이 놓여있습니다.')
      return
    }

    const newBoard = goBoard.map(row => [...row])
    const playerStone = getPlayerStone(currentPlayer)
    newBoard[rowIndex]![colIndex] = playerStone

    const opponentStone =
      playerStone === STONE.BLACK ? STONE.WHITE : STONE.BLACK
    let capturedStones: [number, number][] = []

    for (const [r, c] of getNeighbors(rowIndex, colIndex, boardSize)) {
      if (r == null || c == null) {
        continue
      }

      if (newBoard[r]?.[c] === opponentStone) {
        const { stones, liberties } = getGroupInfo(r, c, newBoard)
        if (liberties === 0) {
          capturedStones = capturedStones.concat(stones)
        }
      }
    }

    capturedStones.forEach(([r, c]) => (newBoard[r]![c] = STONE.EMPTY))

    if (capturedStones.length > 0) {
      if (currentPlayer === PLAYER.BLACK) {
        setBlackCaptured(prev => prev + capturedStones.length)
      } else {
        setWhiteCaptured(prev => prev + capturedStones.length)
      }
    }

    const { liberties: ownLiberties } = getGroupInfo(
      rowIndex,
      colIndex,
      newBoard
    )
    if (ownLiberties === 0 && capturedStones.length === 0) {
      console.log('자살수는 둘 수 없습니다.')
      return
    }

    // 돌을 놓으면 패스 카운트 초기화
    setPassCount(0)
    setGoBoard(newBoard)
    setCurrentPlayer(prevPlayer =>
      prevPlayer === PLAYER.BLACK ? PLAYER.WHITE : PLAYER.BLACK
    )
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-amber-50 p-4 md:p-8 lg:p-12'>
      <FinishedInfo
        gameStatus={gameStatus}
        gameResult={gameResult}
        blackCaptured={blackCaptured}
        whiteCaptured={whiteCaptured}
      />

      <GameInfo
        currentPlayer={currentPlayer}
        blackCaptured={blackCaptured}
        whiteCaptured={whiteCaptured}
        passCount={passCount}
        gameStatus={gameStatus}
        handlePass={handlePass}
        handleResignation={handleResignation}
        resetGame={resetGame}
      />

      <GoBoard goBoard={goBoard} handleCellClick={handleCellClick} />
    </div>
  )
}

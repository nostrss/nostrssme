'use client'
import { useState, useEffect } from 'react'
import { create2DArray } from '@repo/utils'
import GameSettings from '@/components/Go/GameSettings'
import GoBoard from '@/components/Go/GoBoard'
import { Player } from '@/types'
import { BOARD } from '@/constants/go'
import { getGroupInfo, getNeighbors, calculateScore } from '@/utils/go'
import GameInfo from '@/components/Go/GameInfo'

export default function Home() {
  const [boardSize, setBoardSize] = useState(BOARD.SIZE.DEFAULT)
  const [goBoard, setGoBoard] = useState(() =>
    create2DArray(BOARD.SIZE.DEFAULT, BOARD.SIZE.DEFAULT, 0)
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black')
  const [blackCaptured, setBlackCaptured] = useState(0)
  const [whiteCaptured, setWhiteCaptured] = useState(0)
  const [passCount, setPassCount] = useState(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>(
    'playing'
  )
  const [gameResult, setGameResult] = useState<{
    winner: 'black' | 'white'
    blackScore: number
    whiteScore: number
    scoreDifference: number
    blackTerritory: number
    whiteTerritory: number
    endType: 'score' | 'resignation'
  } | null>(null)

  const getPlayerStoneValue = (currentPlayer: Player) => {
    return currentPlayer === 'black' ? 1 : 2
  }

  const resetGame = () => {
    setGoBoard(create2DArray(boardSize, boardSize, 0))
    setCurrentPlayer('black')
    setBlackCaptured(0)
    setWhiteCaptured(0)
    setPassCount(0)
    setGameStatus('playing')
    setGameResult(null)
  }

  useEffect(() => {
    resetGame()
  }, [boardSize])

  const handlePass = () => {
    if (gameStatus !== 'playing') return

    const newPassCount = passCount + 1
    setPassCount(newPassCount)

    if (newPassCount >= 2) {
      // 게임 종료 - 점수 계산
      const result = calculateScore(goBoard, blackCaptured, whiteCaptured)
      setGameResult({
        ...result,
        endType: 'score',
      })
      setGameStatus('finished')
      return
    }

    setCurrentPlayer(prevPlayer => (prevPlayer === 'black' ? 'white' : 'black'))
  }

  const handleResignation = () => {
    if (gameStatus !== 'playing') return

    const winner = currentPlayer === 'black' ? 'white' : 'black'

    // 기권 시에는 점수 계산 없이 상대방 승리
    setGameResult({
      winner,
      blackScore: 0,
      whiteScore: 0,
      scoreDifference: 0,
      blackTerritory: 0,
      whiteTerritory: 0,
      endType: 'resignation',
    })
    setGameStatus('finished')
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (gameStatus !== 'playing') return

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

    if (capturedStones.length > 0) {
      if (currentPlayer === 'black') {
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
      />

      {gameStatus === 'finished' && gameResult && (
        <div className='mb-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200'>
          <h2 className='text-2xl font-bold text-center mb-4 text-gray-800'>
            게임 종료!
          </h2>
          <div className='text-center space-y-2'>
            <p className='text-xl font-semibold text-blue-600'>
              승자: {gameResult.winner === 'black' ? '흑돌' : '백돌'}
            </p>
            {gameResult.endType === 'resignation' ? (
              <p className='text-lg text-red-600 font-semibold'>
                {gameResult.winner === 'black' ? '백돌' : '흑돌'} 기권으로 승부
                결정
              </p>
            ) : (
              <>
                <p className='text-lg text-gray-700'>
                  점수차: {gameResult.scoreDifference.toFixed(1)}점
                </p>
                <div className='grid grid-cols-2 gap-4 mt-4 text-sm'>
                  <div className='bg-gray-800 text-white p-3 rounded'>
                    <p className='font-semibold'>흑돌</p>
                    <p>영역: {gameResult.blackTerritory}점</p>
                    <p>잡은 돌: {blackCaptured}점</p>
                    <p className='font-bold'>
                      총점: {gameResult.blackScore.toFixed(1)}점
                    </p>
                  </div>
                  <div className='bg-gray-100 text-gray-800 p-3 rounded'>
                    <p className='font-semibold'>백돌</p>
                    <p>영역: {gameResult.whiteTerritory}점</p>
                    <p>잡은 돌: {whiteCaptured}점</p>
                    <p>코미: 6.5점</p>
                    <p className='font-bold'>
                      총점: {gameResult.whiteScore.toFixed(1)}점
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <GameInfo
        currentPlayer={currentPlayer}
        blackCaptured={blackCaptured}
        whiteCaptured={whiteCaptured}
        passCount={passCount}
      />

      <div className='mb-4 flex gap-4'>
        {gameStatus === 'playing' ? (
          <>
            <button
              onClick={handlePass}
              className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors'
            >
              패스 ({currentPlayer === 'black' ? '흑' : '백'})
            </button>
            <button
              onClick={handleResignation}
              className='px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors'
            >
              기권 ({currentPlayer === 'black' ? '흑' : '백'})
            </button>
          </>
        ) : (
          <button
            onClick={resetGame}
            className='px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors'
          >
            새 게임 시작
          </button>
        )}
      </div>

      <GoBoard goBoard={goBoard} handleCellClick={handleCellClick} />
    </div>
  )
}

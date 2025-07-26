'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { create2DArray } from '@repo/utils'
import GoBoard from '@/components/Go/game/GoBoard'
import { GameResult, GameStatus, Player, PlayerConfig, Stone } from '@/types'
import {
  BOARD,
  PLAYER,
  GAME_STATUS,
  GAME_END_TYPE,
  STONE,
  PLAYER_TYPE,
} from '@/constants/go'
import { getGroupInfo, getNeighbors, calculateScore } from '@/utils/go'
import GameInfo from '@/components/Go/game/GameInfo'
import FinishedInfo from '@/components/Go/game/FinishedInfo'
import { requestAiNextStone } from '@/api/go'

export default function Home() {
  const searchParams = useSearchParams()

  // Get query parameters with defaults
  const boardSizeParam = searchParams.get('boardSize')
  const blackPlayerParam = searchParams.get('blackPlayer')
  const whitePlayerParam = searchParams.get('whitePlayerType')
  const komiParam = searchParams.get('komi')

  // Parse and validate boardSize
  const initialBoardSize = boardSizeParam
    ? Math.max(
        BOARD.SIZE.MIN,
        Math.min(BOARD.SIZE.MAX, parseInt(boardSizeParam, 10))
      )
    : BOARD.SIZE.DEFAULT

  // Parse komi with default
  const initialKomi = komiParam ? parseFloat(komiParam) : 6.5

  // Parse player configurations
  const blackPlayerConfig: PlayerConfig = {
    type: blackPlayerParam || PLAYER_TYPE.PERSON,
    isAI: blackPlayerParam !== PLAYER_TYPE.PERSON,
    aiModel: blackPlayerParam !== PLAYER_TYPE.PERSON ? blackPlayerParam || undefined : undefined,
  }

  const whitePlayerConfig: PlayerConfig = {
    type: whitePlayerParam || PLAYER_TYPE.PERSON,
    isAI: whitePlayerParam !== PLAYER_TYPE.PERSON,
    aiModel: whitePlayerParam !== PLAYER_TYPE.PERSON ? whitePlayerParam || undefined : undefined,
  }

  const [boardSize] = useState(initialBoardSize)
  const [komi] = useState(initialKomi)
  const [blackPlayer] = useState(blackPlayerConfig)
  const [whitePlayer] = useState(whitePlayerConfig)
  const [goBoard, setGoBoard] = useState<Stone[][]>(() =>
    create2DArray(initialBoardSize, initialBoardSize, STONE.EMPTY)
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER.BLACK)
  const [blackCaptured, setBlackCaptured] = useState(0)
  const [whiteCaptured, setWhiteCaptured] = useState(0)
  const [passCount, setPassCount] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.PLAYING)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)

  const getPlayerStone = (currentPlayer: Player): Stone => {
    return currentPlayer === PLAYER.BLACK ? STONE.BLACK : STONE.WHITE
  }

  const getCurrentPlayerConfig = useCallback((): PlayerConfig => {
    return currentPlayer === PLAYER.BLACK ? blackPlayer : whitePlayer
  }, [currentPlayer, blackPlayer, whitePlayer])

  const isCurrentPlayerAI = useCallback((): boolean => {
    return getCurrentPlayerConfig().isAI
  }, [getCurrentPlayerConfig])

  const getCurrentPlayerModel = useCallback((): string | undefined => {
    return getCurrentPlayerConfig().aiModel
  }, [getCurrentPlayerConfig])

  const resetGame = () => {
    setGoBoard(create2DArray(boardSize, boardSize, STONE.EMPTY))
    setCurrentPlayer(PLAYER.BLACK)
    setBlackCaptured(0)
    setWhiteCaptured(0)
    setPassCount(0)
    setGameStatus(GAME_STATUS.PLAYING)
    setGameResult(null)
    setIsAiThinking(false)
  }

  const handlePass = useCallback(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) return

    const newPassCount = passCount + 1
    setPassCount(newPassCount)

    if (newPassCount >= 2) {
      // 게임 종료 - 점수 계산
      const result = calculateScore(goBoard, blackCaptured, whiteCaptured, komi)
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
  }, [gameStatus, passCount, goBoard, blackCaptured, whiteCaptured, komi])

  const handleResignation = useCallback(() => {
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
  }, [gameStatus, currentPlayer])

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (gameStatus !== GAME_STATUS.PLAYING) return
    if (isAiThinking) return // AI가 생각하는 중이면 클릭 막기

    if (rowIndex === -1 && colIndex === -1) {
      handlePass()
      return
    }

    if (rowIndex === -2 && colIndex === -2) {
      handleResignation()
      return
    }

    // 현재 플레이어가 AI인 경우 사람이 클릭할 수 없음
    if (isCurrentPlayerAI()) {
      console.log('AI 플레이어의 턴입니다.')
      return
    }

    if (goBoard[rowIndex]![colIndex] !== STONE.EMPTY) {
      console.log('이곳에는 이미 돌이 놓여있습니다.')
      return
    }

    makeMove(rowIndex, colIndex)
  }

  const makeMove = useCallback((rowIndex: number, colIndex: number) => {
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
  }, [goBoard, currentPlayer, boardSize])

  // AI 플레이어의 수를 처리하는 useEffect
  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) return
    if (!isCurrentPlayerAI()) return

    const aiModel = getCurrentPlayerModel()
    if (!aiModel) return

    setIsAiThinking(true)
    
    requestAiNextStone(goBoard, currentPlayer, aiModel)
      .then(response => {
        if (response.success) {
          const [row, col] = response.position
          
          if (response.isPass) {
            handlePass()
          } else if (response.isResignation) {
            handleResignation()
          } else {
            makeMove(row, col)
          }
        } else {
          console.error('AI 이동 실패:', response.error)
        }
      })
      .catch(error => {
        console.error('AI API 호출 오류:', error)
      })
      .finally(() => {
        setIsAiThinking(false)
      })
  }, [currentPlayer, gameStatus, goBoard, isCurrentPlayerAI, getCurrentPlayerModel, handlePass, handleResignation, makeMove])

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-amber-50 p-4 md:p-8 lg:p-12'>
      <FinishedInfo
        gameStatus={gameStatus}
        gameResult={gameResult}
        blackCaptured={blackCaptured}
        whiteCaptured={whiteCaptured}
        komi={komi}
      />

      <GameInfo
        currentPlayer={currentPlayer}
        blackCaptured={blackCaptured}
        whiteCaptured={whiteCaptured}
        passCount={passCount}
        gameStatus={gameStatus}
        komi={komi}
        handlePass={handlePass}
        handleResignation={handleResignation}
        resetGame={resetGame}
      />

      <GoBoard goBoard={goBoard} handleCellClick={handleCellClick} />
    </div>
  )
}

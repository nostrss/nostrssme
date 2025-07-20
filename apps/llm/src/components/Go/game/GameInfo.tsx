import { GAME_STATUS, PLAYER } from '@/constants/go'
import { GameInfoProps } from '@/types'

export default function GameInfo({
  blackCaptured,
  whiteCaptured,
  currentPlayer,
  passCount,
  gameStatus,
  komi,
  handlePass,
  handleResignation,
  resetGame,
}: GameInfoProps) {
  return (
    <div className='mb-2 flex flex-row gap-4 items-center'>
      <p className='text-base md:text-lg text-black'>
        현재 차례:
        <span className='font-bold'>
          {currentPlayer === 'black' ? '흑' : '백'}
        </span>
      </p>
      <div className='flex flex-row gap-4'>
        <span className='text-black'>흑 잡은 돌: {blackCaptured}</span>
        <span className='text-black'>백 잡은 돌: {whiteCaptured}</span>
        <span className='text-black'>코미: {komi}</span>
      </div>
      {passCount > 0 && (
        <div className='text-sm text-gray-600'>연속 패스 횟수: {passCount}</div>
      )}
      <div className='mb-4 flex gap-4'>
        {gameStatus === GAME_STATUS.PLAYING ? (
          <>
            <button
              onClick={handlePass}
              className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors'
            >
              패스 ({currentPlayer === PLAYER.BLACK ? '흑' : '백'})
            </button>
            <button
              onClick={handleResignation}
              className='px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors'
            >
              기권 ({currentPlayer === PLAYER.BLACK ? '흑' : '백'})
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
    </div>
  )
}

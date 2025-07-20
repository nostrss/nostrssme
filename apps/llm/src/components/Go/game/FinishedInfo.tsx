import { GAME_END_TYPE, GAME_STATUS, PLAYER } from '@/constants/go'
import { GameResult, GameStatus } from '@/types'

export default function FinishedInfo({
  gameStatus,
  gameResult,
  blackCaptured,
  whiteCaptured,
}: {
  gameStatus: GameStatus
  gameResult: GameResult | null
  blackCaptured: number
  whiteCaptured: number
}) {
  return (
    <>
      {gameStatus === GAME_STATUS.FINISHED && gameResult && (
        <div className='mb-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200'>
          <h2 className='text-2xl font-bold text-center mb-4 text-gray-800'>
            게임 종료!
          </h2>
          <div className='text-center space-y-2'>
            <p className='text-xl font-semibold text-blue-600'>
              승자: {gameResult.winner === PLAYER.BLACK ? '흑돌' : '백돌'}
            </p>
            {gameResult.endType === GAME_END_TYPE.RESIGNATION ? (
              <p className='text-lg text-red-600 font-semibold'>
                {gameResult.winner === PLAYER.BLACK ? '백돌' : '흑돌'} 기권으로
                승부 결정
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
    </>
  )
}

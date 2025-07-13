import { GameInfoProps } from '@/types'

export default function GameInfo({
  blackCaptured,
  whiteCaptured,
  currentPlayer,
  passCount,
}: GameInfoProps) {
  return (
    <div className='mb-2 flex flex-col gap-4 items-center'>
      <p className='text-base md:text-lg text-black'>
        현재 차례:
        <span className='font-bold'>
          {currentPlayer === 'black' ? '흑' : '백'}
        </span>
      </p>
      <div className='flex flex-row gap-4'>
        <span className='text-black'>흑 잡은 돌: {blackCaptured}</span>
        <span className='text-black'>백 잡은 돌: {whiteCaptured}</span>
      </div>
      {passCount > 0 && (
        <div className='text-sm text-gray-600'>연속 패스 횟수: {passCount}</div>
      )}
    </div>
  )
}

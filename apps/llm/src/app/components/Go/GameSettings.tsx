import { BOARD } from '@/app/constants/go'
import { GameSettingsProps } from '@/app/types'

export default function GoBoardSettings({
  boardSize,
  currentPlayer,
  handleBoardSizeChange,
}: GameSettingsProps) {
  return (
    <div className='mb-4 flex flex-row justify-center items-center'>
      <div>
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
            { length: BOARD.SIZE.MAX - BOARD.SIZE.MIN + 1 },
            (_, i) => BOARD.SIZE.MIN + i
          ).map(size => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>
      </div>
      <p className='text-base md:text-lg ml-4'>
        현재 차례:
        <span className='font-bold'>
          {currentPlayer === 'black' ? '흑' : '백'}
        </span>
      </p>
    </div>
  )
}

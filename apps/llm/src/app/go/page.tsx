import { GameInfoForm } from '@/components/Go/go/GameInfoForm'

export default function GoPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <GameInfoForm />
      </div>
    </div>
  )
}

import { SetUpForm } from '@/components/Go/setup/SetUpForm'

export default function GoPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-5xl'>
        <SetUpForm />
      </div>
    </div>
  )
}

'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { AI_MODELS, PLAYER_TYPE } from '@/constants/go'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { SetupFormData } from '@/types'

export function SetUpForm() {
  const router = useRouter()
  const [boardSize, setBoardSize] = useState<number[]>([5])
  const [blackPlayer, setBlackPlayer] = useState<string>('')
  const [whitePlayer, setWhitePlayer] = useState<string>('')
  const [komi, setKomi] = useState<number[]>([6.5])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const setupFormSchema = z.object({
    boardSize: z.number().min(5).max(19),
    blackPlayer: z.string().min(1),
    whitePlayer: z.string().min(1),
    komi: z.number().min(0).max(10),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})

    const formData: SetupFormData = {
      boardSize: boardSize[0] ?? 5,
      blackPlayer,
      whitePlayer,
      komi: komi[0] ?? 6.5,
    }

    try {
      setupFormSchema.parse(formData)
      router.push(
        `/go/game?boardSize=${formData.boardSize}&blackPlayer=${formData.blackPlayer}&whitePlayerType=${formData.whitePlayer}&komi=${formData.komi}`
      )
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach(issue => {
          if (issue.path.length > 0) {
            errors[String(issue.path[0])] = issue.message
          }
        })
        setFieldErrors(errors)
      } else console.error('Unexpected error:', error)
    }
  }

  return (
    <div className='flex flex-col gap-6 w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Play Go with a variety of AI models.</CardTitle>
          <CardDescription>
            You can challenge a Go match against an AI model of your choice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <Label>Board Size</Label>
                  <div className='text-sm text-muted-foreground'>
                    {`${boardSize} x ${boardSize}`}
                  </div>
                </div>
                <Slider
                  defaultValue={boardSize}
                  min={3}
                  max={19}
                  step={1}
                  onValueChange={setBoardSize}
                  className='w-full'
                />
                {fieldErrors.boardSize && (
                  <div className='text-red-500 text-sm mt-1'>
                    {fieldErrors.boardSize}
                  </div>
                )}
              </div>
              <div className='grid gap-3'>
                <Label>Black Stone Player</Label>
                <Select value={blackPlayer} onValueChange={setBlackPlayer}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Black Player type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PLAYER_TYPE.PERSON}>Person</SelectItem>
                    {Object.entries(AI_MODELS).map(([providerName, models]) => (
                      <div key={providerName}>
                        {Object.entries(models).map(
                          ([modelKey, modelLabel]) => (
                            <SelectItem key={modelKey} value={modelKey}>
                              {modelLabel}
                            </SelectItem>
                          )
                        )}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.blackPlayer && (
                  <div className='text-red-500 text-sm mt-1'>
                    {fieldErrors.blackPlayer}
                  </div>
                )}
              </div>
              <div className='grid gap-3'>
                <Label>White Stone Player</Label>
                <Select value={whitePlayer} onValueChange={setWhitePlayer}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select White Player type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PLAYER_TYPE.PERSON}>Person</SelectItem>
                    {Object.entries(AI_MODELS).map(([providerName, models]) => (
                      <div key={providerName}>
                        {Object.entries(models).map(
                          ([modelKey, modelLabel]) => (
                            <SelectItem key={modelKey} value={modelKey}>
                              {modelLabel}
                            </SelectItem>
                          )
                        )}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.whitePlayer && (
                  <div className='text-red-500 text-sm mt-1'>
                    {fieldErrors.whitePlayer}
                  </div>
                )}
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <Label>Komi</Label>
                  <div className='text-sm text-muted-foreground'>{komi[0]}</div>
                </div>
                <Slider
                  defaultValue={komi}
                  max={10}
                  step={0.5}
                  onValueChange={setKomi}
                  className='w-full'
                />
                {fieldErrors.komi && (
                  <div className='text-red-500 text-sm mt-1'>
                    {fieldErrors.komi}
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={!blackPlayer || !whitePlayer}
                >
                  Start Game
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

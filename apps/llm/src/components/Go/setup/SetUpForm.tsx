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
import { AI_MODEL, PLAYER } from '@/constants/go'
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

export function SetUpForm() {
  const router = useRouter()
  const [boardSize, setBoardSize] = useState<number[]>([5])
  const [stone, setStone] = useState<string>(PLAYER.BLACK)
  const [model, setModel] = useState<string>('')
  const [komi, setKomi] = useState<number[]>([6.5])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(
      `/go/game?boardSize=${boardSize[0]}&stone=${stone}&model=${model}&komi=${komi[0]}`
    )
  }

  return (
    <div className='flex flex-col gap-6 w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Enter Game info</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <Label>Board Size</Label>
                  <div className='text-sm text-muted-foreground'>
                    {boardSize}
                  </div>
                </div>
                <Slider
                  defaultValue={boardSize}
                  min={5}
                  max={19}
                  step={1}
                  onValueChange={setBoardSize}
                  className='w-full'
                />
              </div>
              <div className='grid gap-3'>
                <Label>Choose your stone color</Label>
                <Select value={stone} onValueChange={setStone}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a stone' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PLAYER.BLACK}>Black</SelectItem>
                    <SelectItem value={PLAYER.WHITE}>White</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-3'>
                <Label>Choose Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a Ai Model' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AI_MODEL).map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              </div>
              <div className='flex flex-col gap-3'>
                <Button type='submit' className='w-full'>
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

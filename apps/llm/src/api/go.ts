import { Player } from '@/types'

export const requestAiNextStone = async (
  board: number[][], 
  player: Player, 
  model?: string
) => {
  const response = await fetch('/api/go', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board, player, model }),
  })
  return response.json()
}

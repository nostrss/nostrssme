export const requestAiNextStone = async (board: number[][], model?: string) => {
  const response = await fetch('/api/go', {
    method: 'POST',
    body: JSON.stringify({ board, model }),
  })
  return response.json()
}

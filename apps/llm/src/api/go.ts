export const requestAiNextStone = async (board: number[][]) => {
  const response = await fetch('/api/go', {
    method: 'POST',
    body: JSON.stringify({ board }),
  })
  return response.json()
}

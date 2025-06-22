export const getNeighbors = (r: number, c: number, size: number) => {
  return [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ].filter(
    ([nr, nc]) =>
      nr !== undefined &&
      nc !== undefined &&
      nr >= 0 &&
      nr < size &&
      nc >= 0 &&
      nc < size
  )
}

export const getGroupInfo = (
  startRow: number,
  startCol: number,
  board: number[][]
) => {
  const color = board[startRow]?.[startCol]
  if (color === 0 || color === undefined) {
    return { stones: [], liberties: 0 }
  }

  const stones: [number, number][] = []
  const liberties = new Set<string>()
  const queue: [number, number][] = [[startRow, startCol]]
  const visited = new Set<string>([`${startRow},${startCol}`])

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    stones.push([r, c])

    const neighbors = getNeighbors(r, c, board.length)
    for (const [nr, nc] of neighbors) {
      if (nr == null || nc == null) {
        continue
      }

      const neighborKey = `${nr},${nc}`
      const neighborColor = board[nr]?.[nc]

      if (neighborColor === 0) {
        liberties.add(neighborKey)
      } else if (neighborColor === color && !visited.has(neighborKey)) {
        visited.add(neighborKey)
        queue.push([nr, nc])
      }
    }
  }

  return { stones, liberties: liberties.size }
}

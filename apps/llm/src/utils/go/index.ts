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

// 영역 계산 함수
export const calculateTerritory = (board: number[][]) => {
  const visited = new Set<string>()
  const territories: {
    positions: [number, number][]
    owner: 'black' | 'white' | 'neutral'
  }[] = []

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r]!.length; c++) {
      const key = `${r},${c}`

      // 빈 공간이고 아직 방문하지 않은 곳
      if (board[r]![c] === 0 && !visited.has(key)) {
        const territory = exploreTerritory(r, c, board, visited)
        territories.push(territory)
      }
    }
  }

  return territories
}

// 특정 영역 탐색
const exploreTerritory = (
  startRow: number,
  startCol: number,
  board: number[][],
  visited: Set<string>
) => {
  const positions: [number, number][] = []
  const boundaryColors = new Set<number>()
  const queue: [number, number][] = [[startRow, startCol]]
  const localVisited = new Set<string>([`${startRow},${startCol}`])

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    positions.push([r, c])
    visited.add(`${r},${c}`)

    const neighbors = getNeighbors(r, c, board.length)
    for (const [nr, nc] of neighbors) {
      if (nr == null || nc == null) continue

      const neighborKey = `${nr},${nc}`
      const neighborColor = board[nr]?.[nc]

      if (neighborColor !== undefined) {
        if (neighborColor === 0 && !localVisited.has(neighborKey)) {
          localVisited.add(neighborKey)
          queue.push([nr, nc])
        } else if (neighborColor !== 0) {
          boundaryColors.add(neighborColor)
        }
      }
    }
  }

  // 영역의 소유자 결정
  let owner: 'black' | 'white' | 'neutral' = 'neutral'

  if (boundaryColors.size === 1) {
    const boundaryColor = Array.from(boundaryColors)[0]
    owner = boundaryColor === 1 ? 'black' : 'white'
  }

  return { positions, owner }
}

// 최종 점수 계산
export const calculateScore = (
  board: number[][],
  blackCaptured: number,
  whiteCaptured: number,
  komi: number = 6.5 // 코미 (백돌 보정)
) => {
  const territories = calculateTerritory(board)

  let blackTerritory = 0
  let whiteTerritory = 0

  territories.forEach(territory => {
    if (territory.owner === 'black') {
      blackTerritory += territory.positions.length
    } else if (territory.owner === 'white') {
      whiteTerritory += territory.positions.length
    }
  })

  const blackScore = blackTerritory + blackCaptured
  const whiteScore = whiteTerritory + whiteCaptured + komi

  return {
    blackScore,
    whiteScore,
    blackTerritory,
    whiteTerritory,
    winner: blackScore > whiteScore ? 'black' : ('white' as 'black' | 'white'),
    scoreDifference: Math.abs(blackScore - whiteScore),
  }
}

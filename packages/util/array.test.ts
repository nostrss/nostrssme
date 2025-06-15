import { create2DArray } from './array'

describe('Array Utilities', () => {
  describe('create2DArray', () => {
    it('should create a 2D array filled with specified value', () => {
      const rows = 3
      const cols = 3
      const value = 0
      const result = create2DArray(rows, cols, value)

      expect(result).toHaveLength(rows)
      expect(result[0]).toHaveLength(cols)
      expect(result.every(row => row.every(cell => cell === value))).toBe(true)
    })

    it('should create a 2D array with different types', () => {
      const rows = 3
      const cols = 2
      const value = 'test'
      const result = create2DArray(rows, cols, value)

      expect(result).toHaveLength(rows)
      expect(result[0]).toHaveLength(cols)
      expect(result.every(row => row.every(cell => cell === value))).toBe(true)
    })
  })
})

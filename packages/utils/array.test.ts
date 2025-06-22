import { create2DArray } from './array'

describe('Array Utilities', () => {
  describe('create2DArray', () => {
    it('should create a 2D array with correct dimensions', () => {
      const result = create2DArray(2, 3, 0)

      expect(result).toHaveLength(2) // 2 rows
      expect(result[0]).toHaveLength(3) // 3 columns
      expect(result[1]).toHaveLength(3) // 3 columns
    })

    it('should fill all elements with the specified value', () => {
      const result = create2DArray(3, 4, 5)

      expect(result).toEqual([
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5],
      ])
    })

    it('should work with different data types', () => {
      // String type
      const stringArray = create2DArray(2, 2, 'test')
      expect(stringArray).toEqual([
        ['test', 'test'],
        ['test', 'test'],
      ])

      // Boolean type
      const boolArray = create2DArray(2, 2, true)
      expect(boolArray).toEqual([
        [true, true],
        [true, true],
      ])

      // Object type
      const objArray = create2DArray(2, 2, { id: 1 })
      expect(objArray).toEqual([
        [{ id: 1 }, { id: 1 }],
        [{ id: 1 }, { id: 1 }],
      ])
    })

    it('should create 1x1 array correctly', () => {
      const result = create2DArray(1, 1, 42)
      expect(result).toEqual([[42]])
    })

    it('should create rectangular arrays (non-square)', () => {
      const result = create2DArray(2, 5, 'x')
      expect(result).toEqual([
        ['x', 'x', 'x', 'x', 'x'],
        ['x', 'x', 'x', 'x', 'x'],
      ])
    })

    it('should create large arrays efficiently', () => {
      const result = create2DArray(100, 100, 0)

      expect(result).toHaveLength(100)
      expect(result[0]).toHaveLength(100)
      expect(result[99]).toHaveLength(100)
      expect(result[50][50]).toBe(0)
    })

    it('should handle zero dimensions gracefully', () => {
      const result = create2DArray(0, 0, 0)
      expect(result).toEqual([])
    })

    it('should create arrays with negative values as content', () => {
      const result = create2DArray(2, 2, -1)
      expect(result).toEqual([
        [-1, -1],
        [-1, -1],
      ])
    })

    it('should create arrays with null values', () => {
      const result = create2DArray(2, 2, null)
      expect(result).toEqual([
        [null, null],
        [null, null],
      ])
    })

    it('should create arrays with undefined values', () => {
      const result = create2DArray(2, 2, undefined)
      expect(result).toEqual([
        [undefined, undefined],
        [undefined, undefined],
      ])
    })

    it('should maintain reference independence between rows', () => {
      const result = create2DArray(2, 2, { value: 1 })

      // Modify one element
      result[0][0].value = 999

      // Since all elements reference the same object, all should be modified
      expect(result[0][1].value).toBe(999)
      expect(result[1][0].value).toBe(999)
      expect(result[1][1].value).toBe(999)
    })

    it('should create independent arrays when using primitive values', () => {
      const result = create2DArray(2, 2, 1)

      // Modify one element
      result[0][0] = 999

      // Other elements should remain unchanged
      expect(result[0][1]).toBe(1)
      expect(result[1][0]).toBe(1)
      expect(result[1][1]).toBe(1)
    })
  })
})

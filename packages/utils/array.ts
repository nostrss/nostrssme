/**
 * 지정된 값으로 채워진 2차원 배열을 생성합니다
 * @param rows 행의 개수
 * @param cols 열의 개수
 * @param value 배열을 채울 값
 * @returns 지정된 값으로 채워진 2차원 배열
 */

export function create2DArray<T>(rows: number, cols: number, value: T): T[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(value))
}

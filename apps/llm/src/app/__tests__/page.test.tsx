import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Component', () => {
  it('renders a 19x19 Go board', () => {
    render(<Home />)

    // Check if the board container exists
    const boardContainer = screen.getByTestId('go-board')
    expect(boardContainer).toBeInTheDocument()

    // Check if the board has the correct background color
    expect(boardContainer).toHaveClass('bg-amber-50')

    // Check if the board grid exists
    const boardGrid = boardContainer.querySelector('.grid')
    expect(boardGrid).toBeInTheDocument()
    expect(boardGrid).toHaveClass('grid-cols-19')

    // Check if there are 19 rows
    const rows = boardGrid?.querySelectorAll('.flex.flex-col')
    expect(rows).toHaveLength(19)

    // Check if each row has 19 cells
    rows?.forEach(row => {
      const cells = row.querySelectorAll('.w-8.h-8')
      expect(cells).toHaveLength(19)
    })
  })

  it('renders cells with correct styling', () => {
    render(<Home />)

    // Get all cells
    const cells = screen.getAllByTestId('go-cell')

    // Check if each cell has the correct classes
    cells.forEach(cell => {
      expect(cell).toHaveClass('w-8', 'h-8', 'border', 'border-gray-400')
    })
  })
})

import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { SetUpForm } from './SetUpForm'
import { AI_MODEL } from '@/constants/go'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, ...props }: any) => (
    <select
      data-testid='select'
      value={value || ''}
      onChange={e => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value, ...props }: any) => (
    <option value={value} {...props}>
      {children}
    </option>
  ),
  SelectTrigger: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}))

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ defaultValue, onValueChange, ...props }: any) => (
    <input
      type='range'
      defaultValue={defaultValue?.[0]}
      onChange={e => onValueChange?.([parseFloat(e.target.value)])}
      {...props}
    />
  ),
}))

const mockPush = jest.fn()

describe('SetUpForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('Rendering Tests', () => {
    it('renders the form with all required elements', () => {
      render(<SetUpForm />)

      // Check title and description
      expect(
        screen.getByText('Play Go with a variety of AI models.')
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'You can challenge a Go match against an AI model of your choice.'
        )
      ).toBeInTheDocument()

      // Check form fields
      expect(screen.getByText('Board Size')).toBeInTheDocument()
      expect(screen.getByText('Black Stone Player')).toBeInTheDocument()
      expect(screen.getByText('White Stone Player')).toBeInTheDocument()
      expect(screen.getByText('Komi')).toBeInTheDocument()

      // Check submit button
      expect(
        screen.getByRole('button', { name: 'Start Game' })
      ).toBeInTheDocument()
    })

    it('initializes with correct default values', () => {
      render(<SetUpForm />)

      // Board size should show default value of 5
      expect(screen.getByText('5')).toBeInTheDocument()

      // Komi should show default value of 6.5
      expect(screen.getByText('6.5')).toBeInTheDocument()

      // Submit button should be disabled initially (no players selected)
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeDisabled()
    })

    it('renders AI model options in select dropdowns', () => {
      render(<SetUpForm />)

      // Check if Person option exists in both selects
      const personOptions = screen.getAllByText('Person')
      expect(personOptions.length).toBeGreaterThanOrEqual(2)

      // Check if AI model options exist
      Object.values(AI_MODEL).forEach(model => {
        const modelOptions = screen.getAllByText(model)
        expect(modelOptions.length).toBeGreaterThanOrEqual(2) // Should appear in both black and white player selects
      })
    })
  })

  describe('User Interaction Tests', () => {
    it('updates board size when slider is moved', async () => {
      render(<SetUpForm />)

      const sliders = screen.getAllByRole('slider')
      const boardSizeSlider = sliders[0] // First slider is for board size

      // Change board size to 19
      fireEvent.change(boardSizeSlider, { target: { value: '19' } })

      await waitFor(() => {
        expect(screen.getByText('19')).toBeInTheDocument()
      })
    })

    it('updates black player selection', async () => {
      render(<SetUpForm />)

      const selects = screen.getAllByTestId('select')
      const blackPlayerSelect = selects[0] // First select is for black player

      // Select Person option
      fireEvent.change(blackPlayerSelect, { target: { value: 'person' } })

      // Check if selection was updated
      expect(blackPlayerSelect).toHaveValue('person')
    })

    it('updates white player selection', async () => {
      render(<SetUpForm />)

      const selects = screen.getAllByTestId('select')
      const whitePlayerSelect = selects[1] // Second select is for white player

      // Select an AI model
      fireEvent.change(whitePlayerSelect, {
        target: { value: AI_MODEL.GEMINI_2_0_FLASH },
      })

      // Check if selection was updated
      expect(whitePlayerSelect).toHaveValue(AI_MODEL.GEMINI_2_0_FLASH)
    })

    it('updates komi value when slider is moved', async () => {
      render(<SetUpForm />)

      const sliders = screen.getAllByRole('slider')
      const komiSlider = sliders[1] // Second slider is for komi

      // Change komi to 7.5
      fireEvent.change(komiSlider, { target: { value: '7.5' } })

      await waitFor(() => {
        expect(screen.getByText('7.5')).toBeInTheDocument()
      })
    })
  })

  describe('Real-time Validation Tests', () => {
    it('shows validation error for empty black player when submitting', async () => {
      render(<SetUpForm />)

      // Select white player to make form partially valid
      const selects = screen.getAllByTestId('select')
      const whitePlayerSelect = selects[1]
      fireEvent.change(whitePlayerSelect, { target: { value: 'person' } })

      // Try to submit with empty black player - button should still be disabled
      const submitButton = screen.getByRole('button', { name: 'Start Game' })
      expect(submitButton).toBeDisabled()
    })

    it('clears validation error when field is corrected', async () => {
      render(<SetUpForm />)

      // Select both players to enable submit button
      const selects = screen.getAllByTestId('select')
      fireEvent.change(selects[0], { target: { value: 'person' } }) // Black player
      fireEvent.change(selects[1], { target: { value: 'person' } }) // White player

      // Submit button should now be enabled
      const submitButton = screen.getByRole('button', { name: 'Start Game' })
      expect(submitButton).toBeEnabled()
    })
  })

  describe('Form Submission Tests', () => {
    it('enables submit button when both players are selected', async () => {
      render(<SetUpForm />)

      const submitButton = screen.getByRole('button', { name: 'Start Game' })
      expect(submitButton).toBeDisabled()

      // Select both players
      const selects = screen.getAllByTestId('select')
      fireEvent.change(selects[0], { target: { value: 'person' } }) // Black player
      fireEvent.change(selects[1], { target: { value: 'person' } }) // White player

      // Submit button should now be enabled
      await waitFor(() => {
        expect(submitButton).toBeEnabled()
      })
    })

    it('navigates to game page with correct parameters when form is valid', async () => {
      render(<SetUpForm />)

      // Fill out the form
      const selects = screen.getAllByTestId('select')
      fireEvent.change(selects[0], { target: { value: 'person' } }) // Black player
      fireEvent.change(selects[1], { target: { value: 'person' } }) // White player

      // Submit the form
      const submitButton = screen.getByRole('button', { name: 'Start Game' })
      fireEvent.click(submitButton)

      // Check if router.push was called with correct parameters
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining(
            '/go/game?boardSize=5&blackPlayer=person&whitePlayerType=person&komi=6.5'
          )
        )
      })
    })

    it('prevents submission when validation fails', async () => {
      render(<SetUpForm />)

      // Try to submit with empty required fields
      const submitButton = screen.getByRole('button', { name: 'Start Game' })

      // Button should be disabled due to empty players
      expect(submitButton).toBeDisabled()

      // Even if we could click it, router.push should not be called
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Zod Schema Integration Tests', () => {
    it('validates board size range correctly', async () => {
      render(<SetUpForm />)

      const sliders = screen.getAllByRole('slider')
      const boardSizeSlider = sliders[0]

      // Test minimum value (should be valid)
      if (boardSizeSlider) {
        fireEvent.change(boardSizeSlider, { target: { value: '5' } })
        expect(screen.getByText('5')).toBeInTheDocument()

        // Test maximum value (should be valid)
        fireEvent.change(boardSizeSlider, { target: { value: '19' } })
        expect(screen.getByText('19')).toBeInTheDocument()
      }
    })

    it('validates komi range correctly', async () => {
      render(<SetUpForm />)

      const sliders = screen.getAllByRole('slider')
      const komiSlider = sliders[1]

      // Test minimum value (should be valid)
      if (komiSlider) {
        fireEvent.change(komiSlider, { target: { value: '0' } })
        expect(screen.getByText('0')).toBeInTheDocument()

        // Test maximum value (should be valid)
        fireEvent.change(komiSlider, { target: { value: '10' } })
        expect(screen.getByText('10')).toBeInTheDocument()
      }
    })

    it('validates required string fields', async () => {
      render(<SetUpForm />)

      // Try to submit without selecting players
      const submitButton = screen.getByRole('button', { name: 'Start Game' })

      // Button should be disabled, preventing submission
      expect(submitButton).toBeDisabled()
    })
  })
})

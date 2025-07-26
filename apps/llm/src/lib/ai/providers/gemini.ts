import { GoogleGenAI, Type } from '@google/genai'
import { BaseAIProvider, AIResponse } from './base'
import { Player, Stone } from '@/types'
import { AI_PROVIDER, AI_MODELS, PLAYER } from '@/constants/go'

export class GeminiProvider extends BaseAIProvider {
  name = AI_PROVIDER.GEMINI
  models = Object.keys(AI_MODELS[AI_PROVIDER.GEMINI])

  private getPrompt(player: Player): string {
    const playerColor = player === PLAYER.BLACK ? 'Black' : 'White'
    const playerValue = player === PLAYER.BLACK ? 1 : 2
    const opponentColor = player === PLAYER.BLACK ? 'White' : 'Black'
    const opponentValue = player === PLAYER.BLACK ? 2 : 1

    return `You are a professional Go (Baduk) player. You are playing as ${playerColor} stones (value ${playerValue}) against an opponent playing ${opponentColor} stones (value ${opponentValue}).

You will receive a 2D array representing the current Go board state.
Array values: 0 = empty space, 1 = black stone, 2 = white stone

You are ${playerColor} (value ${playerValue}). Choose where to place your stone and return the position as [row, column].

Return the position as a JSON array with exactly 2 numbers: [row, column]
- row: 0-based row index
- column: 0-based column index

BASIC GO RULES:

Liberty rule states that every stone remaining on the board must have at least one open point (a liberty) directly orthogonally adjacent (up, down, left, or right), or must be part of a connected group that has at least one such open point (liberty) next to it. Stones or groups of stones which lose their last liberty are removed from the board.

Repetition Rule (the ko rule) states that a stone on the board must never immediately repeat a previous position of a captured stone, thus only a move elsewhere on the board is permitted that turn.

Go Rules to Follow:
- CRITICAL: You CANNOT place a stone where there's already a stone (occupied positions). This is an illegal move and will result in an error.
- SUICIDE MOVES are FORBIDDEN: You cannot place a stone that would result in immediate capture of your own group. A suicide move occurs when placing a stone creates a group with no liberties (breathing spaces) and no possibility of capturing opponent stones to gain liberties. NEVER make suicide moves.
- Consider capturing opponent stones by surrounding them
- Think strategically about territory and influence
- RESIGNATION: If you determine that you have no realistic chance of winning (e.g., significant territory disadvantage, large groups captured, or opponent has overwhelming advantage), you should resign by returning [-2, -2]. This is a sign of good sportsmanship and acknowledges your opponent's superior play.
- If no good move is available, you may pass by returning [-1, -1]

Return the position as [row, column] where you want to place your stone.`
  }

  async generateMove(
    board: Stone[][],
    player: Player,
    model: string
  ): Promise<AIResponse> {
    if (!this.validateModel(model)) {
      return this.createErrorResponse(`Invalid model: ${model}`)
    }

    try {
      const apiKey = process.env.GOOGLE_API_KEY
      if (!apiKey) {
        return this.createErrorResponse('Google API key not configured')
      }

      const genai = new GoogleGenAI({ apiKey })

      const response = await genai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ text: JSON.stringify(board) }],
          },
        ],
        config: {
          systemInstruction: this.getPrompt(player),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.NUMBER,
            },
            minItems: 2,
            maxItems: 2,
          },
        },
      })

      const responseText = response.text || ''
      let aiPosition: [number, number]

      try {
        aiPosition = JSON.parse(responseText)

        if (!Array.isArray(aiPosition) || aiPosition.length !== 2) {
          throw new Error('AI response is not a valid position array')
        }

        const [row, col] = aiPosition

        // 패스인 경우
        if (row === -1 && col === -1) {
          return this.createSuccessResponse([-1, -1], true)
        }

        // 기권인 경우
        if (row === -2 && col === -2) {
          return this.createSuccessResponse([-2, -2], false, true)
        }

        return this.createSuccessResponse(aiPosition)
      } catch (parseError) {
        console.error('AI 응답 파싱 오류:', parseError)
        console.error('AI 원본 응답:', responseText)
        return this.createErrorResponse('AI 응답을 파싱할 수 없습니다.')
      }
    } catch (error) {
      console.error('Gemini API 오류:', error)
      return this.createErrorResponse('Gemini API 호출 중 오류가 발생했습니다.')
    }
  }
}
import OpenAI from 'openai'
import { BaseAIProvider, AIResponse } from './base'
import { Player, Stone } from '@/types'
import { AI_PROVIDER, AI_MODELS, PLAYER } from '@/constants/go'

export class OpenAIProvider extends BaseAIProvider {
  name = AI_PROVIDER.OPENAI
  models = Object.keys(AI_MODELS[AI_PROVIDER.OPENAI])

  private getPrompt(player: Player): string {
    const playerColor = player === PLAYER.BLACK ? 'Black' : 'White'
    const playerValue = player === PLAYER.BLACK ? 1 : 2
    const opponentColor = player === PLAYER.BLACK ? 'White' : 'Black'
    const opponentValue = player === PLAYER.BLACK ? 2 : 1

    return `You are a professional Go (Baduk) player. You are playing as ${playerColor} stones (value ${playerValue}) against an opponent playing ${opponentColor} stones (value ${opponentValue}).

You will receive a 2D array representing the current Go board state.
Array values: 0 = empty space, 1 = black stone, 2 = white stone

You are ${playerColor} (value ${playerValue}). Choose where to place your stone and return the position as a JSON array.

RESPONSE FORMAT: Return ONLY a JSON array with exactly 2 numbers: [row, column]
- row: 0-based row index
- column: 0-based column index
- Do not include any explanation, reasoning, or additional text

BASIC GO RULES:

Liberty rule: Every stone must have at least one adjacent empty point (liberty) or be part of a connected group that has at least one liberty. Stones without liberties are captured and removed.

Ko rule: You cannot immediately repeat a previous board position.

CRITICAL RULES:
- NEVER place a stone where there's already a stone (occupied positions)
- NEVER make suicide moves (placing a stone that results in immediate capture of your own group without capturing opponent stones)
- Consider territory control and capture opportunities
- Think strategically about influence and territory

SPECIAL MOVES:
- To resign: return [-2, -2]
- To pass: return [-1, -1]

Return ONLY the JSON array [row, column] for your move.`
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
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        return this.createErrorResponse('OpenAI API key not configured')
      }

      const openai = new OpenAI({ apiKey })

      const response = await openai.chat.completions.create({
        model,
        max_tokens: 50,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: this.getPrompt(player) + '\n\nReturn your response as a JSON object with a "position" field containing the [row, column] array.',
          },
          {
            role: 'user',
            content: `Current board state: ${JSON.stringify(board)}`,
          },
        ],
      })

      const responseText = response.choices[0]?.message?.content || ''
      let aiPosition: [number, number]

      try {
        const parsed = JSON.parse(responseText)
        aiPosition = parsed.position || parsed

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
        console.error('OpenAI 응답 파싱 오류:', parseError)
        console.error('OpenAI 원본 응답:', responseText)
        return this.createErrorResponse('OpenAI 응답을 파싱할 수 없습니다.')
      }
    } catch (error) {
      console.error('OpenAI API 오류:', error)
      return this.createErrorResponse('OpenAI API 호출 중 오류가 발생했습니다.')
    }
  }
}
import Anthropic from '@anthropic-ai/sdk'
import { BaseAIProvider, AIResponse } from './base'
import { Player, Stone } from '@/types'
import { AI_PROVIDER, AI_MODELS, PLAYER } from '@/constants/go'

export class ClaudeProvider extends BaseAIProvider {
  name = AI_PROVIDER.CLAUDE
  models = Object.keys(AI_MODELS[AI_PROVIDER.CLAUDE])

  private getPrompt(player: Player): string {
    const playerColor = player === PLAYER.BLACK ? 'Black' : 'White'
    const playerValue = player === PLAYER.BLACK ? 1 : 2
    const opponentColor = player === PLAYER.BLACK ? 'White' : 'Black'
    const opponentValue = player === PLAYER.BLACK ? 2 : 1

    return `You are a professional Go (Baduk) player. You are playing as ${playerColor} stones (value ${playerValue}) against an opponent playing ${opponentColor} stones (value ${opponentValue}).

You will receive a 2D array representing the current Go board state.
Array values: 0 = empty space, 1 = black stone, 2 = white stone

You are ${playerColor} (value ${playerValue}). Choose where to place your stone and return ONLY the position as a JSON array.

CRITICAL: Your response must be ONLY a JSON array with exactly 2 numbers: [row, column]
- row: 0-based row index
- column: 0-based column index
- Do not include any explanation or additional text

BASIC GO RULES:

Liberty rule: Every stone must have at least one adjacent empty point (liberty) or be part of a connected group that has at least one liberty. Stones without liberties are captured and removed.

Ko rule: You cannot immediately repeat a previous board position by recapturing a stone that was just captured.

CRITICAL RULES:
- NEVER place a stone where there's already a stone (occupied positions)
- NEVER make suicide moves (placing a stone that creates a group with no liberties unless it captures opponent stones)
- Consider territory control and stone capture opportunities
- If you want to resign: return [-2, -2]
- If you want to pass: return [-1, -1]

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
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        return this.createErrorResponse('Anthropic API key not configured')
      }

      const anthropic = new Anthropic({ apiKey })

      const response = await anthropic.messages.create({
        model,
        max_tokens: 100,
        system: this.getPrompt(player),
        messages: [
          {
            role: 'user',
            content: JSON.stringify(board),
          },
        ],
      })

      const responseText = response.content[0]?.type === 'text' ? response.content[0].text : ''
      let aiPosition: [number, number]

      try {
        // Claude 응답에서 JSON 부분만 추출
        const jsonMatch = responseText.match(/\[[-]?\d+,\s*[-]?\d+\]/)
        if (!jsonMatch) {
          throw new Error('No valid JSON array found in response')
        }

        aiPosition = JSON.parse(jsonMatch[0])

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
        console.error('Claude 응답 파싱 오류:', parseError)
        console.error('Claude 원본 응답:', responseText)
        return this.createErrorResponse('Claude 응답을 파싱할 수 없습니다.')
      }
    } catch (error) {
      console.error('Claude API 오류:', error)
      return this.createErrorResponse('Claude API 호출 중 오류가 발생했습니다.')
    }
  }
}
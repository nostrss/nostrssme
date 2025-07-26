import { Player, Stone } from '@/types'

export interface AIResponse {
  position: [number, number]
  isPass?: boolean
  isResignation?: boolean
  success: boolean
  error?: string
}

export interface AIProvider {
  name: string
  models: string[]
  generateMove(
    board: Stone[][],
    player: Player,
    model: string
  ): Promise<AIResponse>
}

export abstract class BaseAIProvider implements AIProvider {
  abstract name: string
  abstract models: string[]

  abstract generateMove(
    board: Stone[][],
    player: Player,
    model: string
  ): Promise<AIResponse>

  protected validateModel(model: string): boolean {
    return this.models.includes(model)
  }

  protected createErrorResponse(error: string): AIResponse {
    return {
      position: [-1, -1],
      success: false,
      error,
    }
  }

  protected createSuccessResponse(
    position: [number, number],
    isPass = false,
    isResignation = false
  ): AIResponse {
    return {
      position,
      isPass,
      isResignation,
      success: true,
    }
  }
}

export enum AIProviderType {
  GEMINI = 'gemini',
  CLAUDE = 'claude',
  OPENAI = 'openai',
}
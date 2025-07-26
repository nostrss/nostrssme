import { AIProvider } from './providers/base'
import { GeminiProvider } from './providers/gemini'
import { ClaudeProvider } from './providers/claude'
import { OpenAIProvider } from './providers/openai'
import { AI_MODELS } from '@/constants/go'

class AIProviderFactory {
  private providers: Map<string, AIProvider> = new Map()

  constructor() {
    this.registerProvider(new GeminiProvider())
    this.registerProvider(new ClaudeProvider())
    this.registerProvider(new OpenAIProvider())
  }

  private registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider)
  }

  getProvider(model: string): AIProvider | null {
    // 모델 이름으로부터 프로바이더 찾기
    for (const [providerName, models] of Object.entries(AI_MODELS)) {
      if (Object.keys(models).includes(model)) {
        return this.providers.get(providerName) || null
      }
    }
    return null
  }

  getProviderByName(providerName: string): AIProvider | null {
    return this.providers.get(providerName) || null
  }

  getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values())
  }

  getAllModels(): Record<string, string[]> {
    const result: Record<string, string[]> = {}
    for (const provider of this.providers.values()) {
      result[provider.name] = provider.models
    }
    return result
  }

  isValidModel(model: string): boolean {
    return this.getProvider(model) !== null
  }

  getModelsByProvider(providerName: string): string[] {
    const provider = this.providers.get(providerName)
    return provider ? provider.models : []
  }
}

export const aiProviderFactory = new AIProviderFactory()

export { AIProviderFactory }
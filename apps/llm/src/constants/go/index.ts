export const BOARD = {
  SIZE: {
    MIN: 5,
    MAX: 19,
    DEFAULT: 5,
  },
}

export const PLAYER = {
  BLACK: 'black',
  WHITE: 'white',
} as const

export const STONE = {
  EMPTY: 0,
  BLACK: 1,
  WHITE: 2,
} as const

export const GAME_STATUS = {
  PLAYING: 'playing',
  FINISHED: 'finished',
} as const

export const GAME_END_TYPE = {
  SCORE: 'score',
  RESIGNATION: 'resignation',
  TWO_PASSES: 'two_passes',
} as const

export const AI_PROVIDER = {
  GEMINI: 'gemini',
  CLAUDE: 'claude',
  OPENAI: 'openai',
} as const

export const AI_MODELS = {
  [AI_PROVIDER.GEMINI]: {
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
  },
  [AI_PROVIDER.CLAUDE]: {
    'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet 20241022',
    'claude-3-7-sonnet-20250219': 'Claude 3.7 Sonnet 20250219',
    'claude-sonnet-4-20250514': 'Claude Sonnet 4 20250514',
  },
  [AI_PROVIDER.OPENAI]: {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini',
    'gpt-4.1': 'GPT-4.1',
    'gpt-4.1-mini': 'GPT-4.1 Mini',
  },
} as const

export const AI_MODEL = {
  GEMINI_2_0_FLASH: 'gemini-2.0-flash',
  GEMINI_2_5_FLASH: 'gemini-2.5-flash',
  GEMINI_2_5_PRO: 'gemini-2.5-pro',
  CLAUDE_3_5_SONNET_20241022: 'claude-3-5-sonnet-20241022',
  CLAUDE_3_7_SONNET_20250219: 'claude-3-7-sonnet-20250219',
  CLAUDE_SONNET_4_20250514: 'claude-sonnet-4-20250514',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4_1: 'gpt-4.1',
  GPT_4_1_MINI: 'gpt-4.1-mini',
} as const

export const PLAYER_TYPE = {
  PERSON: 'person',
} as const

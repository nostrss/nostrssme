import { z } from 'zod'

export const setupFormSchema = z.object({
  boardSize: z.number().min(5).max(19),
  blackPlayer: z.string().min(1),
  whitePlayer: z.string().min(1),
  komi: z.number().min(0).max(10),
})

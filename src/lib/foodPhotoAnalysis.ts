import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'

const DetectedFoodSchema = z.object({
  name: z.string().describe('Short name of the food item, e.g. "Chicken curry" or "Steamed rice"'),
  estimatedQuantity: z.string().describe('Best-guess portion size in a natural unit, e.g. "1 bowl", "200g", "2 rotis"'),
  calories: z.number().describe('Estimated total calories for the portion shown'),
  protein: z.number().describe('Estimated protein in grams'),
  carbs: z.number().describe('Estimated carbohydrates in grams'),
  fat: z.number().describe('Estimated fat in grams'),
})

const PhotoAnalysisSchema = z.object({
  items: z.array(DetectedFoodSchema).describe('Every distinct food item visible in the photo, logged separately (e.g. curry separate from rice)'),
})

export interface DetectedFood {
  name: string
  estimatedQuantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export class FoodPhotoAnalysisError extends Error {}

export async function analyzeFoodPhoto(apiKey: string, base64Data: string, mediaType: string): Promise<DetectedFood[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  let response
  try {
    response = await client.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', data: base64Data },
            },
            {
              type: 'text',
              text: 'Identify every distinct food item in this photo (an Indian home-cooked plate may have several — curry, rice, roti, dal, etc. — list each separately). For each, estimate the portion size and its calories, protein, carbs, and fat based on what is visibly on the plate. Give your best estimate even if not 100% certain.',
            },
          ],
        },
      ],
      output_config: {
        format: zodOutputFormat(PhotoAnalysisSchema),
      },
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new FoodPhotoAnalysisError('That API key was rejected. Check it in Settings.')
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new FoodPhotoAnalysisError('Rate limited by the API. Try again in a moment.')
    }
    if (err instanceof Anthropic.APIError) {
      throw new FoodPhotoAnalysisError(`API error: ${err.message}`)
    }
    throw new FoodPhotoAnalysisError('Could not reach the AI service. Check your connection.')
  }

  if (!response.parsed_output) {
    throw new FoodPhotoAnalysisError('Could not read the food in that photo. Try a clearer, closer shot.')
  }

  return response.parsed_output.items
}

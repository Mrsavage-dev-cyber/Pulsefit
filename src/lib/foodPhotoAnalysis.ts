import { Type } from '@google/genai'
import { createGeminiClient, describeGeminiError, withGeminiRetries, GEMINI_VISION_MODEL } from './gemini'

export interface DetectedFood {
  name: string
  estimatedQuantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export class FoodPhotoAnalysisError extends Error {}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: 'Every distinct food item visible in the photo, logged separately (e.g. curry separate from rice)',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Short name of the food item, e.g. "Chicken curry" or "Steamed rice"' },
          estimatedQuantity: { type: Type.STRING, description: 'Best-guess portion size in a natural unit, e.g. "1 bowl", "200g", "2 rotis"' },
          calories: { type: Type.NUMBER, description: 'Estimated total calories for the portion shown' },
          protein: { type: Type.NUMBER, description: 'Estimated protein in grams' },
          carbs: { type: Type.NUMBER, description: 'Estimated carbohydrates in grams' },
          fat: { type: Type.NUMBER, description: 'Estimated fat in grams' },
        },
        required: ['name', 'estimatedQuantity', 'calories', 'protein', 'carbs', 'fat'],
      },
    },
  },
  required: ['items'],
}

export async function analyzeFoodPhoto(apiKey: string, base64Data: string, mediaType: string): Promise<DetectedFood[]> {
  const ai = createGeminiClient(apiKey)

  let text: string | undefined
  try {
    const response = await withGeminiRetries(() =>
      ai.models.generateContent({
        model: GEMINI_VISION_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: mediaType, data: base64Data } },
              {
                text: 'Identify every distinct food item in this photo (an Indian home-cooked plate may have several — curry, rice, roti, dal, etc. — list each separately). For each, estimate the portion size and its calories, protein, carbs, and fat based on what is visibly on the plate. Give your best estimate even if not 100% certain.',
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    )
    text = response.text
  } catch (err) {
    throw new FoodPhotoAnalysisError(describeGeminiError(err))
  }

  if (!text) {
    throw new FoodPhotoAnalysisError('Could not read the food in that photo. Try a clearer, closer shot.')
  }

  try {
    const parsed = JSON.parse(text) as { items: DetectedFood[] }
    return parsed.items
  } catch {
    throw new FoodPhotoAnalysisError('Could not read the food in that photo. Try a clearer, closer shot.')
  }
}

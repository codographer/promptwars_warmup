import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// JSON schema definition for structured Gemini responses
const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    meals: {
      type: Type.OBJECT,
      properties: {
        breakfast: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            instructions: { type: Type.STRING }
          },
          required: ["name", "prepTime", "instructions"]
        },
        lunch: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            instructions: { type: Type.STRING }
          },
          required: ["name", "prepTime", "instructions"]
        },
        dinner: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            instructions: { type: Type.STRING }
          },
          required: ["name", "prepTime", "instructions"]
        }
      },
      required: ["breakfast", "lunch", "dinner"]
    },
    groceryList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          estimatedCost: { type: Type.NUMBER }
        },
        required: ["item", "estimatedCost"]
      }
    },
    substitutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          substitute: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["original", "substitute", "reason"]
      }
    },
    budgetFeasibility: {
      type: Type.OBJECT,
      properties: {
        totalEstimatedCost: { type: Type.NUMBER },
        isFeasible: { type: Type.BOOLEAN },
        reasoning: { type: Type.STRING }
      },
      required: ["totalEstimatedCost", "isFeasible", "reasoning"]
    },
    cookingTodo: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          timeOfDay: { type: Type.STRING }
        },
        required: ["task", "timeOfDay"]
      }
    }
  },
  required: ["meals", "groceryList", "substitutions", "budgetFeasibility", "cookingTodo"]
};

export async function POST(request: Request) {
  try {
    if (!ai) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured on the server." },
        { status: 500 }
      );
    }

    const { dayDescription, budget, dietConstraints } = await request.json();

    if (!dayDescription || !budget) {
      return NextResponse.json(
        { error: "Missing required fields: dayDescription and budget are required." },
        { status: 400 }
      );
    }

    const prompt = `
Generate a structured, healthy, and budget-friendly meal plan (breakfast, lunch, dinner) and cooking checklist for a user based on the details below:

- User's Day Description: "${dayDescription}"
- Total Budget limit: $${budget}
- Diet constraints/preferences: "${dietConstraints || 'None specified'}"

Please ensure the estimated grocery cost aligns with the budget limit of $${budget}. Output exact substitutions for common high-cost or allergen items, and list a chronological cooking to-do schedule suited to their day's schedule description.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: planSchema,
        temperature: 0.2,
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from Gemini API");
    }

    const parsedPlan = JSON.parse(resultText);
    return NextResponse.json(parsedPlan);

  } catch (error: any) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while generating your plan." },
      { status: 500 }
    );
  }
}

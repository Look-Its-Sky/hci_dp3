import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import type { UserFinancialProfile, NewScenarioData, Recommendation } from "../types";

// Schema for the structured output from the LLM
const RecommendationSchema = z.object({
  text: z.string().describe("Actionable advice"),
  priority: z.string().refine(val => ['high', 'medium', 'low'].includes(val as any), { message: "Invalid priority" }),
  impact: z.number().describe("Estimated financial impact in USD (positive value = savings/gain)"),
});

const ScenarioAnalysisSchema = z.object({
  totalCost: z.number().describe("The total immediate financial impact. Positive value = COST/LOSS. Negative value = GAIN/WINDFALL."),
  impactPeriod: z.string().refine(val => ['one-time', 'recurring'].includes(val as any), { message: "Invalid impact period" }),
  costEachPeriod: z.number().describe("If recurring, the cost per period (Positive = Cost). 0 if one-time."),
  periodUnit: z.string().default('month'),
  recommendations: z.array(RecommendationSchema).describe("3-5 personalized recommendations based on the scenario"),
  title: z.string().describe("A refined title for the scenario if needed"),
});

export const analyzeScenario = async (
  scenarioName: string,
  scenarioDescription: string,
  userProfile: UserFinancialProfile
): Promise<{
  scenarioData: NewScenarioData;
  recommendations: Recommendation[];
}> => {
  const apiKey = "lets not be broke!";

  const model = new ChatOpenAI({
    apiKey: apiKey,
    modelName: "DP3_Advisor:latest",
    configuration: {
      baseURL: "http://64.181.210.250:11434/v1",
    },
  });

  const structuredModel = model.withStructuredOutput(ScenarioAnalysisSchema);

  const prompt = `
    You are a financial advisor AI. Analyze the following scenario for the given user profile.

    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Scenario to Analyze:
    Title: "${scenarioName}"
    Description: "${scenarioDescription}"

    Task:
    1. Estimate the financial impact ("totalCost"). 
       - If it's a "Market Crash (30%)", calculate 30% of their investment portfolio.
       - If it's "Job Loss", calculate lost income based on duration (assume 6 months if unspecified).
       - If it's a specific purchase, estimate the cost.
       - POSITIVE number means it COSTS money (bad). NEGATIVE number means GAIN (good).
    2. Determine if it's one-time or recurring.
    3. Provide 3-5 specific, actionable recommendations to mitigate risks or maximize benefits.
       - "impact" for recommendations should be how much they SAVE or GAIN by doing it (Positive Value).
  `;

  try {
    const result = await structuredModel.invoke(prompt);

    // Map result to app's data structures
    const scenarioData: NewScenarioData = {
      title: result.title || scenarioName,
      impactPeriod: result.impactPeriod,
      totalCost: result.totalCost,
      costEachPeriod: result.costEachPeriod,
      periodUnit: result.periodUnit || 'month',
    };

    const recommendations: Recommendation[] = result.recommendations.map((rec: z.infer<typeof RecommendationSchema>, index: number) => ({
      id: `gen-rec-${Date.now()}-${index}`,
      text: rec.text,
      checked: false, // Default to unchecked
      priority: rec.priority,
      impact: rec.impact,
    }));

    return { scenarioData, recommendations };

  } catch (error) {
    console.error("Error analyzing scenario with AI:", error);
    throw error;
  }
};

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { UserFinancialProfile, Recommendation } from '../types';

const OLLAMA_BASE_URL = 'http://64.181.210.250:11434/v1';
const MODEL_NAME = 'DP3_Advisor:latest';

let chatModel: ChatOpenAI | null = null;

const getChatModel = () => {
  if (!chatModel) {
    chatModel = new ChatOpenAI({
      modelName: MODEL_NAME,
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 60000,
      configuration: {
        baseURL: OLLAMA_BASE_URL,
      },
      apiKey: 'ollama',
    });
  }
  return chatModel;
};

export interface AIRecommendationRequest {
  user: UserFinancialProfile;
  scenarioTitle: string;
  scenarioCost: number;
  projectedBalance: number;
  currentNetWorth: number;
  monthlySavings: number;
  savingsRate: number;
  appliedRecommendations?: string[];
}

export const generateAIRecommendations = async (
  request: AIRecommendationRequest
): Promise<Recommendation[]> => {
  const {
    user,
    scenarioTitle,
    scenarioCost,
    projectedBalance,
    currentNetWorth,
    monthlySavings,
    savingsRate,
    appliedRecommendations = [],
  } = request;

  const totalExpenses = Object.values(user.monthlyExpenses).reduce((a, b) => a + b, 0);
  const emergencyFundMonths = user.accounts.savings.balance / totalExpenses;

  const systemPrompt = `You are a professional financial advisor AI. Analyze the user's financial situation and provide personalized, actionable recommendations.

IMPORTANT: You must respond ONLY with a valid JSON array of recommendations. No other text, explanations, or markdown.

Each recommendation must follow this exact format:
[
  {
    "id": "unique-id-string",
    "text": "Clear, specific recommendation with dollar amounts",
    "impact": number (estimated yearly financial impact in dollars),
    "priority": "high" | "medium" | "low"
  }
]

Guidelines:
- Provide 4-6 specific, personalized recommendations
- Include exact dollar amounts based on the user's actual finances
- Consider the scenario impact and user's risk tolerance
- Prioritize based on urgency and potential impact
- Make recommendations actionable and specific
- Do NOT repeat any previously applied recommendations`;

  const userPrompt = `
USER PROFILE:
- Name: ${user.name}
- Monthly Income: $${user.monthlyIncome.toLocaleString()}
- Monthly Expenses: $${totalExpenses.toLocaleString()}
- Monthly Savings: $${monthlySavings.toLocaleString()} (${savingsRate.toFixed(1)}% rate)
- Risk Tolerance: ${user.riskTolerance}
- Credit Score: ${user.creditScore}

CURRENT ASSETS:
- Checking: $${user.accounts.checking.balance.toLocaleString()}
- Savings: $${user.accounts.savings.balance.toLocaleString()} (${user.accounts.savings.interestRate || 0}% APY)
- Investments: $${user.accounts.investment.balance.toLocaleString()} (${user.accounts.investment.ytdReturn || 0}% YTD)
- Retirement (401k): $${user.accounts.retirement.balance.toLocaleString()}
- Total Net Worth: $${currentNetWorth.toLocaleString()}

FINANCIAL HEALTH:
- Emergency Fund: ${emergencyFundMonths.toFixed(1)} months of expenses
- Expense Ratio: ${((totalExpenses / user.monthlyIncome) * 100).toFixed(1)}%

SCENARIO ANALYSIS:
- Scenario: "${scenarioTitle}"
- Financial Impact: ${scenarioCost > 0 ? '-' : '+'}$${Math.abs(scenarioCost).toLocaleString()}
- Projected Balance After Scenario: $${projectedBalance.toLocaleString()}

GOALS:
${user.goals?.map(g => `- ${g.name}: $${g.currentAmount.toLocaleString()} / $${g.targetAmount.toLocaleString()} (${((g.currentAmount / g.targetAmount) * 100).toFixed(0)}%)`).join('\n') || 'No specific goals set'}

${appliedRecommendations.length > 0 ? `
ALREADY APPLIED (DO NOT REPEAT):
${appliedRecommendations.map(r => `- ${r}`).join('\n')}
` : ''}

Based on this financial profile and the "${scenarioTitle}" scenario, provide personalized recommendations to optimize their financial position. Consider their ${user.riskTolerance} risk tolerance.`;

  try {
    console.log('Calling AI advisor with Ollama...');
    const model = getChatModel();
    
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    const content = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);

    console.log('AI Response received:', content.substring(0, 500));

    // Try multiple JSON extraction patterns
    let jsonData: any[] | null = null;
    
    // Pattern 1: Look for JSON array
    const jsonMatch = content.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      try {
        jsonData = JSON.parse(jsonMatch[0]);
        console.log('Parsed JSON array:', jsonData);
      } catch (e) {
        console.log('Failed to parse JSON array');
      }
    }
    
    // Pattern 2: Try parsing entire content as JSON
    if (!jsonData) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          jsonData = parsed;
        } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
          jsonData = parsed.recommendations;
        }
      } catch (e) {
        console.log('Content is not valid JSON');
      }
    }
    
    // Pattern 3: Extract recommendations from text if no JSON found
    if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
      console.log('No JSON found, extracting from text...');
      const textRecs = extractRecommendationsFromText(content, request);
      if (textRecs.length > 0) {
        return textRecs;
      }
      console.log('Falling back to default recommendations');
      return getFallbackRecommendations(request);
    }

    return jsonData.map((rec: any, index: number) => ({
      id: rec.id || `ai-rec-${Date.now()}-${index}`,
      text: rec.text || rec.recommendation || rec.advice || 'Review your financial strategy',
      checked: false,
      impact: typeof rec.impact === 'number' ? rec.impact : 500,
      priority: ['high', 'medium', 'low'].includes(rec.priority) ? rec.priority : 'medium',
    }));
  } catch (error) {
    console.error('AI recommendation error:', error);
    return getFallbackRecommendations(request);
  }
};

// Extract recommendations from plain text response
const extractRecommendationsFromText = (content: string, request: AIRecommendationRequest): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  // Look for numbered items or bullet points
  const recPatterns = [
    /^\d+[\.\)]\s*(.+)/,           // 1. or 1)
    /^[-•*]\s*(.+)/,               // bullet points
    /^(?:Recommendation|Advice|Tip)[\s:]+(.+)/i,  // labeled items
  ];
  
  lines.forEach((line, index) => {
    for (const pattern of recPatterns) {
      const match = line.match(pattern);
      if (match && match[1] && match[1].length > 20) {
        recommendations.push({
          id: `ai-text-${Date.now()}-${index}`,
          text: match[1].trim(),
          checked: false,
          impact: estimateImpact(match[1], request),
          priority: estimatePriority(match[1]),
        });
        break;
      }
    }
  });
  
  return recommendations.slice(0, 5); // Max 5 recommendations
};

const estimateImpact = (text: string, request: AIRecommendationRequest): number => {
  const lower = text.toLowerCase();
  if (lower.includes('emergency') || lower.includes('savings')) return 1000;
  if (lower.includes('invest') || lower.includes('401k')) return 1500;
  if (lower.includes('debt') || lower.includes('loan')) return 800;
  if (lower.includes('expense') || lower.includes('reduce')) return 500;
  return 600;
};

const estimatePriority = (text: string): 'high' | 'medium' | 'low' => {
  const lower = text.toLowerCase();
  if (lower.includes('immediately') || lower.includes('urgent') || lower.includes('critical')) return 'high';
  if (lower.includes('consider') || lower.includes('optional')) return 'low';
  return 'medium';
};

const getFallbackRecommendations = (request: AIRecommendationRequest): Recommendation[] => {
  const { user, scenarioTitle, scenarioCost, monthlySavings, savingsRate } = request;
  const totalExpenses = Object.values(user.monthlyExpenses).reduce((a, b) => a + b, 0);
  const emergencyFundMonths = user.accounts.savings.balance / totalExpenses;
  const recommendations: Recommendation[] = [];
  const timestamp = Date.now();

  if (emergencyFundMonths < 6) {
    const needed = (totalExpenses * 6) - user.accounts.savings.balance;
    recommendations.push({
      id: `fallback-emergency-${timestamp}`,
      text: `Build emergency fund to 6 months: Add $${Math.round(needed).toLocaleString()} to savings`,
      checked: false,
      impact: Math.round(needed * 0.045),
      priority: emergencyFundMonths < 3 ? 'high' : 'medium',
    });
  }

  if (scenarioTitle.toLowerCase().includes('crash') || scenarioTitle.toLowerCase().includes('market')) {
    recommendations.push({
      id: `fallback-crash-${timestamp}`,
      text: 'Hold investments and avoid panic selling during market downturn',
      checked: false,
      impact: Math.round(user.accounts.investment.balance * 0.15),
      priority: 'high',
    });
  }

  if (scenarioTitle.toLowerCase().includes('job loss')) {
    recommendations.push({
      id: `fallback-job-${timestamp}`,
      text: `Reduce discretionary spending by 50% to save $${Math.round((user.monthlyExpenses.dining + user.monthlyExpenses.entertainment) * 0.5).toLocaleString()}/month`,
      checked: false,
      impact: Math.round((user.monthlyExpenses.dining + user.monthlyExpenses.entertainment) * 0.5 * 6),
      priority: 'high',
    });
  }

  if (savingsRate < 20) {
    const increase = (0.20 - savingsRate / 100) * user.monthlyIncome;
    recommendations.push({
      id: `fallback-savings-${timestamp}`,
      text: `Increase savings rate to 20% by saving additional $${Math.round(increase).toLocaleString()}/month`,
      checked: false,
      impact: Math.round(increase * 12),
      priority: 'medium',
    });
  }

  if (user.accounts.retirement.ytdContribution && user.accounts.retirement.ytdContribution < 23000) {
    const remaining = 23000 - user.accounts.retirement.ytdContribution;
    recommendations.push({
      id: `fallback-401k-${timestamp}`,
      text: `Maximize 401(k) contributions: $${remaining.toLocaleString()} remaining in annual limit`,
      checked: false,
      impact: Math.round(remaining * 0.25),
      priority: 'medium',
    });
  }

  recommendations.push({
    id: `fallback-review-${timestamp}`,
    text: `Review and optimize subscription costs: Currently $${user.monthlyExpenses.subscriptions.toFixed(2)}/month`,
    checked: false,
    impact: Math.round(user.monthlyExpenses.subscriptions * 0.3 * 12),
    priority: 'low',
  });

  return recommendations.slice(0, 5);
};

export const calculateProjections = (
  currentBalance: number,
  monthlySavings: number,
  yearlyReturn: number,
  years: number
): { month: number; value: number; label: string }[] => {
  const data: { month: number; value: number; label: string }[] = [];
  let balance = currentBalance;
  const monthlyReturn = yearlyReturn / 12;

  for (let month = 0; month <= years * 12; month++) {
    const year = Math.floor(month / 12);
    const monthInYear = month % 12;
    
    data.push({
      month,
      value: Math.round(balance),
      label: month === 0 ? 'Now' : `${year}y ${monthInYear}m`,
    });

    balance = balance * (1 + monthlyReturn) + monthlySavings;
  }

  return data;
};

/**
 * DHAROHAR AI Service -- Dharohar AI Heritage Guide
 * Routes all AI chat through the Express /api/ai/chat server endpoint.
 * Gemini API key lives server-side only -- never exposed to the browser.
 */

import { Language } from '../types';

export interface HeritageAIContext {
  monument?: string;
  nativeName?: string;
  location?: string;
  state?: string;
  dynasty?: string;
  ruler?: string;
  historicalPeriod?: string;
  architecturalStyle?: string;
  constructionMaterial?: string;
  constructionTechnique?: string;
  culturalSignificance?: string;
  historicalChronicle?: string;
  legends?: string;
  unescoStatus?: string;
  unescoDetails?: string;
  selectedFeature?: string;
  selectedFeatureDescription?: string;
  selectedFeatureSignificance?: string;
  researchMode?: 'traveller' | 'researcher';
  language?: Language;
}

/** Gemini-format turn stored for multi-turn conversation continuity */
interface GeminiTurn {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

/**
 * Per-session conversation history keyed by a context fingerprint.
 * Keeps the last 12 turns (~6 exchanges) so context stays relevant.
 */
const conversationStore = new Map<string, GeminiTurn[]>();

function getContextKey(context: HeritageAIContext): string {
  return [context.monument || 'general', context.researchMode || 'traveller'].join(':');
}

function getHistory(context: HeritageAIContext): GeminiTurn[] {
  return conversationStore.get(getContextKey(context)) ?? [];
}

function appendHistory(context: HeritageAIContext, userText: string, modelText: string): void {
  const key = getContextKey(context);
  const history = conversationStore.get(key) ?? [];
  history.push({ role: 'user', parts: [{ text: userText }] });
  history.push({ role: 'model', parts: [{ text: modelText }] });
  // Keep last 12 turns (6 exchanges)
  const trimmed = history.slice(-12);
  conversationStore.set(key, trimmed);
}

export const aiService = {
  /**
   * Primary method: Ask Dharohar AI a question with full monument context.
   * Sends the request to the Express /api/ai/chat endpoint (server-side Gemini).
   * Throws on failure so the caller (DharoharAIChat) can show a clean error.
   */
  async askDharoharAI(question: string, context: HeritageAIContext = {}): Promise<string> {
    const conversationHistory = getHistory(context);

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        context,
        conversationHistory
      })
    });

    const data = await response.json().catch(() => ({ success: false, error: 'Invalid server response.' }));

    if (!response.ok || !data.success) {
      const errMsg = data.error || `Server error ${response.status}`;
      console.error('[Dharohar AI] Request failed:', errMsg);
      throw new Error(errMsg);
    }

    const answer: string = data.message;

    // Store this exchange for conversation continuity
    appendHistory(context, question, answer);

    return answer;
  },

  /**
   * Legacy method kept for backward compatibility.
   */
  async getHeritageResponse(query: string, context?: string): Promise<string> {
    return this.askDharoharAI(query, {
      historicalChronicle: context,
      researchMode: 'traveller'
    });
  },

  /**
   * Clear conversation history for a given context (e.g. when user clicks Clear).
   */
  clearHistory(context: HeritageAIContext): void {
    conversationStore.delete(getContextKey(context));
  },

  /**
   * Build a HeritageAIContext from a Monument object.
   */
  buildContext(monument: {
    id: string;
    name: string;
    nativeName?: string;
    location: { city: string; state: string };
    dynasty: string;
    ruler?: string;
    period: string;
    architectureStyle?: string;
    architecturalStyle?: string;
    material?: string;
    constructionMaterial?: string;
    constructionTechnique?: string;
    culturalSignificance?: string;
    history?: string;
    stories?: { title: string; narrative: string }[];
    unescoYear?: number;
    unescoDetails?: string;
  }, options?: {
    selectedFeature?: string;
    selectedFeatureDescription?: string;
    selectedFeatureSignificance?: string;
    researchMode?: 'traveller' | 'researcher';
  }): HeritageAIContext {
    const legendText = monument.stories
      ? monument.stories.map((s) => `${s.title}: ${s.narrative}`).join('\n')
      : undefined;

    return {
      monument: monument.name,
      nativeName: monument.nativeName,
      location: monument.location.city,
      state: monument.location.state,
      dynasty: monument.dynasty,
      ruler: monument.ruler,
      historicalPeriod: monument.period,
      architecturalStyle: monument.architectureStyle || monument.architecturalStyle,
      constructionMaterial: monument.constructionMaterial || monument.material,
      constructionTechnique: monument.constructionTechnique,
      culturalSignificance: monument.culturalSignificance,
      historicalChronicle: monument.history,
      legends: legendText,
      unescoStatus: monument.unescoYear ? `UNESCO World Heritage Site (${monument.unescoYear})` : undefined,
      unescoDetails: monument.unescoDetails,
      selectedFeature: options?.selectedFeature,
      selectedFeatureDescription: options?.selectedFeatureDescription,
      selectedFeatureSignificance: options?.selectedFeatureSignificance,
      researchMode: options?.researchMode || 'traveller',
      language: 'en'
    };
  }
};
/**
 * DHAROHAR AI Service — Sutradhar Heritage Guide
 * Connects to Google Gemini via VITE_GEMINI_API_KEY env variable.
 * All AI communication is isolated inside this service.
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

// Deterministic fallback responses for when Gemini is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  story: `This monument stands as a testament to the artistic and spiritual vision of its patrons. Built during the height of a great dynasty, it served as both a place of worship and a symbol of royal power. Legends speak of divine inspiration guiding the craftsmen who shaped every stone. Walking through its corridors, you are experiencing centuries of devotion preserved in granite.`,
  architecture: `This monument exemplifies the architectural mastery of its era. The skilled craftsmen employed sophisticated techniques — precisely fitted stone joints, carefully calibrated proportions, and ornamental programs that merged aesthetic beauty with structural integrity. Each architectural element carries symbolic meaning rooted in ancient cosmological frameworks.`,
  history: `The monument's history spans multiple centuries, witnessing the rise and fall of dynasties, the devotion of pilgrims, and the attention of modern conservation efforts. Archaeological evidence and epigraphical records provide insights into its patronage, construction timeline, and cultural importance across different historical periods.`,
  default: `Sutradhar AI is currently operating in offline mode. This monument contains a rich wealth of historical, architectural, and cultural significance. Please explore the detailed sections on this page for comprehensive information about its dynasty, construction techniques, and preservation status. You can ask me about specific architectural features, historical context, or cultural significance when the AI connection is restored.`
};

function buildSystemPrompt(mode: 'traveller' | 'researcher'): string {
  const modeInstruction = mode === 'traveller'
    ? 'Prefer simple, engaging, story-driven explanations suitable for a visitor experiencing the monument in person. Keep answers to 2-4 paragraphs. Use vivid language and avoid academic jargon.'
    : 'Prefer structured, detailed scholarly explanations. Include architectural terminology, historical context, dynastic significance, and construction techniques. Organize information clearly.';

  return `You are Sutradhar (सूत्रधार), DHAROHAR's AI heritage cultural guide for Indian monuments and architecture.

Your purpose is to explain Indian heritage accurately, clearly, and respectfully. You are a knowledgeable, warm, and culturally sensitive guide.

BEHAVIOR RULES:
- Use the provided monument context as your primary source of information.
- Do NOT invent historical facts not present in the context.
- If the context does not contain enough information, clearly say more information is needed.
- Distinguish historical evidence from legends or traditional stories when relevant.
- Keep answers understandable and engaging.
- Always respond in English unless the user writes in another language.

MODE: ${mode === 'traveller' ? 'TRAVELLER GUIDE' : 'RESEARCH ASSISTANT'}
${modeInstruction}`;
}

function buildContextString(context: HeritageAIContext): string {
  const parts: string[] = ['=== MONUMENT CONTEXT ==='];

  if (context.monument) parts.push(`Monument: ${context.monument}${context.nativeName ? ` (${context.nativeName})` : ''}`);
  if (context.location) parts.push(`Location: ${context.location}${context.state ? `, ${context.state}` : ''}`);
  if (context.dynasty) parts.push(`Dynasty / Patron: ${context.dynasty}${context.ruler ? ` — ruled by ${context.ruler}` : ''}`);
  if (context.historicalPeriod) parts.push(`Historical Period: ${context.historicalPeriod}`);
  if (context.architecturalStyle) parts.push(`Architectural Style: ${context.architecturalStyle}`);
  if (context.constructionMaterial) parts.push(`Construction Material: ${context.constructionMaterial}`);
  if (context.constructionTechnique) parts.push(`Construction Technique: ${context.constructionTechnique}`);
  if (context.unescoStatus) parts.push(`UNESCO Status: ${context.unescoStatus}`);
  if (context.unescoDetails) parts.push(`UNESCO Details: ${context.unescoDetails}`);
  if (context.culturalSignificance) parts.push(`\nCultural Significance:\n${context.culturalSignificance}`);
  if (context.historicalChronicle) parts.push(`\nHistorical Chronicle:\n${context.historicalChronicle}`);
  if (context.legends) parts.push(`\nLegends & Stories:\n${context.legends}`);

  if (context.selectedFeature) {
    parts.push(`\n=== SELECTED ARCHITECTURAL FEATURE ===`);
    parts.push(`Feature: ${context.selectedFeature}`);
    if (context.selectedFeatureDescription) parts.push(`Description: ${context.selectedFeatureDescription}`);
    if (context.selectedFeatureSignificance) parts.push(`Architectural Significance: ${context.selectedFeatureSignificance}`);
  }

  return parts.join('\n');
}

function getFallbackResponse(question: string): string {
  const lower = question.toLowerCase();
  if (lower.includes('story') || lower.includes('legend') || lower.includes('tell me') || lower.includes('why was')) {
    return FALLBACK_RESPONSES.story;
  }
  if (lower.includes('architect') || lower.includes('style') || lower.includes('construction') || lower.includes('built')) {
    return FALLBACK_RESPONSES.architecture;
  }
  if (lower.includes('history') || lower.includes('dynasty') || lower.includes('period') || lower.includes('when')) {
    return FALLBACK_RESPONSES.history;
  }
  return FALLBACK_RESPONSES.default;
}

export const aiService = {
  /**
   * Primary method: Ask Sutradhar a question with full monument context.
   * Uses Gemini Flash if VITE_GEMINI_API_KEY is configured, falls back gracefully.
   */
  async askSutradhar(question: string, context: HeritageAIContext = {}): Promise<string> {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();

    if (!apiKey) {
      console.warn('[Sutradhar] No VITE_GEMINI_API_KEY found — using fallback responses.');
      await new Promise((r) => setTimeout(r, 600));
      return getFallbackResponse(question);
    }

    const mode = context.researchMode || 'traveller';
    const systemPrompt = buildSystemPrompt(mode);
    const contextString = buildContextString(context);

    const fullPrompt = `${systemPrompt}\n\n${contextString}\n\n=== USER QUESTION ===\n${question}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: mode === 'researcher' ? 800 : 500,
              topP: 0.9
            }
          })
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`[Sutradhar] Gemini API ${response.status}:`, errBody);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      return text.trim();
    } catch (err) {
      console.warn('[aiService] Gemini call failed, using fallback:', err);
      return getFallbackResponse(question);
    }
  },

  /**
   * Legacy method kept for backward compatibility with existing AIGuidePage keyword system.
   */
  async getHeritageResponse(query: string, context?: string): Promise<string> {
    return this.askSutradhar(query, {
      historicalChronicle: context,
      researchMode: 'traveller'
    });
  },

  /**
   * Build a HeritageAIContext from a Monument object.
   * Import from heritageService outside, pass monument here.
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

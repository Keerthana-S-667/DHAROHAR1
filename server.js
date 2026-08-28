import express from 'express';
import dotenv from 'dotenv';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Proxy route for OpenRouteService Directions API
app.get('/api/route', async (req, res) => {
  try {
    const { originLat, originLng, destinationLat, destinationLng, profile = 'foot-walking' } = req.query;

    if (!originLat || !originLng || !destinationLat || !destinationLng) {
      return res.status(400).json({ error: 'Missing coordinates parameters.' });
    }

    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      console.error('ORS_API_KEY is not defined in the environment.');
      return res.status(500).json({ error: 'Routing service configuration error.' });
    }

    const url = `https://api.heigit.org/openrouteservice/v2/directions/${profile}/geojson`;
    
    const body = {
      coordinates: [
        [parseFloat(originLng), parseFloat(originLat)],
        [parseFloat(destinationLng), parseFloat(destinationLat)]
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouteService API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to retrieve route from routing provider.' });
    }

    const data = await response.json();
    
    // Extract geometry, distance, and duration
    if (!data.features || data.features.length === 0) {
      return res.status(404).json({ error: 'No route found between coordinates.' });
    }

    const routeFeature = data.features[0];
    const { distance, duration } = routeFeature.properties.summary;
    const geometry = routeFeature.geometry;

    return res.json({
      distanceMeters: distance,
      durationSeconds: duration,
      geometry
    });

  } catch (error) {
    console.error('Server proxy error:', error);
    return res.status(500).json({ error: 'Internal server error occurred while routing.' });
  }
});


// Caching layer for AI Narration and Audio
// Key: `${monumentId}-${mode}-${language}`
// Value: { text, duration, audioBuffer }
const narrationCache = new Map();

function buildAIAudioPrompt(monumentData, mode, language) {
  const languageNames = {
    en: 'English',
    ta: 'Tamil',
    hi: 'Hindi'
  };
  const languageName = languageNames[language] || 'English';

  let modeText = '';
  switch (mode) {
    case 'quick':
      modeText = `Quick Tour Mode: Generate a concise, engaging audio guide of about 150-180 words (around 1 minute long).
It should welcome the user, briefly introduce the monument name, location, and dynasty, describe its main visual highlights, mention one interesting legend or fact, and conclude gracefully.`;
      break;
    case 'detailed':
      modeText = `Detailed Tour Mode: Generate a comprehensive, deep-dive audio guide of about 500-600 words (around 3-5 minutes long).
It should cover its history and commissioning, dynastic context, building materials and architectural style, key structures or shrines, historical significance, cultural preservation status, and a memorable concluding summary.`;
      break;
    case 'story':
      modeText = `Story Mode: Generate an immersive storytelling experience of about 350-450 words.
It should set the scene vividly (using sensory details like the coastal breeze, carvings, or court atmosphere), bring to life the era and the king's grand vision, and naturally weave historical and architectural details into a narrative flow without fabricating historical events.`;
      break;
    case 'architecture':
      modeText = `Architecture Mode: Generate an architecture-focused audio guide of about 350-450 words.
It should focus in detail on the architectural style, engineering design, dressed stone blocks, structural techniques, layout, relief sculptures, and visual alignment with the environment.`;
      break;
    case 'history':
      modeText = `History Mode: Generate a history-focused chronological guide of about 350-450 words.
It should outline the timeline of the monument, details of the ruling dynasties, patrons, historical events, cultural transitions, and modern heritage milestones.`;
      break;
    case 'student':
      modeText = `Student Mode: Generate a fun, simple, and educational guide of about 250-300 words.
It should explain who built it, when, and why, in simple terms suitable for students and children, highlighting fun facts and easy-to-remember points.`;
      break;
    case 'accessible':
      modeText = `Accessible Mode: Generate a highly descriptive audio guide of about 350-450 words.
It should use clear, simple language to visually describe the size, texture, shapes, layout, and visual placement of the structures so that a visually impaired person can easily visualize the monument through sound.`;
      break;
  }

  const contextParts = [];
  contextParts.push(`Name: ${monumentData.name}`);
  if (monumentData.nativeName) contextParts.push(`Native Name: ${monumentData.nativeName}`);
  if (monumentData.location) contextParts.push(`Location: ${monumentData.location}`);
  if (monumentData.period) contextParts.push(`Historical Period: ${monumentData.period}`);
  if (monumentData.dynasty) contextParts.push(`Dynasty/Patron: ${monumentData.dynasty}`);
  if (monumentData.ruler) contextParts.push(`Ruler/Patron King: ${monumentData.ruler}`);
  if (monumentData.architecturalStyle) contextParts.push(`Architectural Style: ${monumentData.architecturalStyle}`);
  if (monumentData.constructionMaterial) contextParts.push(`Material: ${monumentData.constructionMaterial}`);
  
  if (monumentData.culturalSignificance) {
    contextParts.push(`Cultural Significance: ${monumentData.culturalSignificance}`);
  }
  if (monumentData.history) {
    contextParts.push(`History: ${monumentData.history}`);
  }
  if (monumentData.stories && monumentData.stories.length > 0) {
    contextParts.push(`Legends & Oral History:`);
    monumentData.stories.forEach(s => {
      contextParts.push(`- ${s.title}: ${s.narrative}`);
    });
  }
  if (monumentData.timeline && monumentData.timeline.length > 0) {
    contextParts.push(`Historical Timeline:`);
    monumentData.timeline.forEach(t => {
      contextParts.push(`- Year ${t.year} (${t.period}): ${t.description || t.event || ''}`);
    });
  }

  const prompt = `You are Dharohar AI, an expert heritage guide.
Your task is to write a detailed, complete audio guide script for the following monument.

MONUMENT DETAILS:
${contextParts.join('\n')}

GUIDELINES FOR THE SCRIPT:
1. Mode: ${modeText}
2. Language: Write the ENTIRE script in ${languageName} using its native script (e.g. Devanagari script for Hindi, Tamil script for Tamil, English letters for English).
3. Style: Make the tone warm, educational, and narrative. Do not use any markdown formatting like bold (**), headers (#), lists (- or *), or bullets. Write only complete plain paragraphs.
4. Completeness: Ensure all sentences are fully finished. The narration must be rich and complete, not cut off.
5. Accuracy: Rely on the monument details, and expand using accurate historical facts. Do not invent fictional dates or rulers.

Write the full, complete audio guide script now in ${languageName}:`;

  return prompt;
}

// Generate Gemini Narration Text
async function generateGeminiNarration(prompt) {
  // Read key without VITE_ prefix (server-side only)
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in .env');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: 0.9
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Gemini Narration] API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini');
  }
  
  // Clean markdown bold or list markers that might make TTS sound weird
  return text.replace(/\*\*/g, '').replace(/^[-\*]\s+/gm, '').trim();
}

// 1. Narration generation endpoint
app.post('/api/heritage-audio/narration', async (req, res) => {
  try {
    const {
      monumentId,
      monumentName,
      location,
      period,
      dynasty,
      ruler,
      architecturalStyle,
      constructionMaterial,
      culturalSignificance,
      history,
      stories,
      timeline,
      mode,
      language
    } = req.body;

    if (!monumentId || !mode || !language) {
      return res.status(400).json({ error: 'Missing monumentId, mode, or language.' });
    }

    const cacheKey = `${monumentId}-${mode}-${language}`;
    if (narrationCache.has(cacheKey)) {
      console.log(`[Cache Hit] Narration text for ${cacheKey}`);
      const cached = narrationCache.get(cacheKey);
      return res.json({ text: cached.text, duration: cached.duration || '1:30' });
    }

    console.log(`[Cache Miss] Generating narration text for ${cacheKey}...`);
    const prompt = buildAIAudioPrompt({
      name: monumentName,
      location,
      period,
      dynasty,
      ruler,
      architecturalStyle,
      constructionMaterial,
      culturalSignificance,
      history,
      stories,
      timeline
    }, mode, language);

    const generatedText = await generateGeminiNarration(prompt);
    
    // Estimate reading duration (rough estimate: 130 words per minute)
    const wordCount = generatedText.split(/\s+/).length;
    const minutes = Math.floor(wordCount / 130);
    const seconds = Math.round((wordCount % 130) / 130 * 60);
    const durationStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    narrationCache.set(cacheKey, {
      text: generatedText,
      duration: durationStr,
      audioBuffer: null
    });

    return res.json({ text: generatedText, duration: durationStr });
  } catch (error) {
    console.error('Narration generation error:', error);
    return res.status(500).json({ error: 'Unable to generate the audio guide right now. Please try again.' });
  }
});

// 2. Speech synthesis endpoint
app.get('/api/heritage-audio/speech', async (req, res) => {
  try {
    const { monumentId, mode, language } = req.query;

    if (!monumentId || !mode || !language) {
      return res.status(400).json({ error: 'Missing monumentId, mode, or language parameter.' });
    }

    const cacheKey = `${monumentId}-${mode}-${language}`;
    let cached = narrationCache.get(cacheKey);

    if (!cached || !cached.text) {
      return res.status(404).json({ error: 'Narration script not found. Call narration endpoint first.' });
    }

    if (cached.audioBuffer) {
      console.log(`[Cache Hit] Audio buffer for ${cacheKey}`);
      res.set('Content-Type', 'audio/mpeg');
      return res.send(cached.audioBuffer);
    }

    console.log(`[Cache Miss] Generating Edge TTS audio for ${cacheKey}...`);

    const VOICE_MAPPING = {
      en: 'en-IN-NeerjaNeural',
      ta: 'ta-IN-PallaviNeural',
      hi: 'hi-IN-SwaraNeural'
    };

    const voice = VOICE_MAPPING[language] || 'en-IN-NeerjaNeural';
    const rate = mode === 'accessible' ? '-15%' : '+0%';

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const streamObj = tts.toStream(cached.text, { rate: rate });
    const readable = streamObj.audioStream;

    const chunks = [];
    await new Promise((resolve, reject) => {
      readable.on("data", (chunk) => chunks.push(chunk));
      readable.on("end", () => resolve());
      readable.on("error", (err) => reject(err));
    });
    const audioBuffer = Buffer.concat(chunks);

    cached.audioBuffer = audioBuffer;
    narrationCache.set(cacheKey, cached);

    res.set('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);

  } catch (error) {
    console.error('Edge TTS generation error:', error);
    return res.status(500).json({ error: 'Unable to generate the audio guide right now. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dharohar AI Chat endpoint — proxies user questions to Gemini
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context = {}, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[AI Chat] No Gemini API key configured. Set GEMINI_API_KEY in .env');
      return res.status(503).json({
        success: false,
        error: 'Dharohar AI is not configured. GEMINI_API_KEY is missing on the server.'
      });
    }

    // ── Build system instruction ──────────────────────────────────────────
    const mode = context.researchMode || 'traveller';
    const modeInstruction = mode === 'researcher'
      ? 'Prefer structured, detailed scholarly explanations. Include architectural terminology, historical context, dynastic significance, and construction techniques. Organize information clearly.'
      : 'Prefer simple, engaging, story-driven explanations suitable for a visitor experiencing the monument in person. Keep answers to 2-4 paragraphs. Use vivid language and avoid academic jargon.';

    const systemInstruction = `You are Dharohar AI, the heritage and cultural guide for the DHAROHAR Digital Indian Heritage platform.

Your specialization includes Indian monuments, architecture, archaeology, dynasties, historical timelines, architectural history, cultural history, traditional construction techniques, heritage preservation, and monument symbolism.

BEHAVIOR RULES:
- Provide accurate, informative, and understandable answers.
- Never invent historical facts. If information is uncertain or disputed, clearly say so.
- Always respond in English unless the user explicitly asks for Tamil or Hindi.
- If the user asks in Tamil, respond naturally in Tamil. If in Hindi, respond in Hindi.
- Do not repeatedly mention that you are an AI.
- Answer the actual question directly without excessive preambles.
- Be informative but concise.
- Do not give generic responses when the question is clearly about Indian heritage.

MODE: ${mode === 'researcher' ? 'RESEARCH ASSISTANT' : 'TRAVELLER GUIDE'}
${modeInstruction}`;

    // ── Build monument context block ──────────────────────────────────────
    const contextParts = [];
    if (context.monument) contextParts.push(`Monument: ${context.monument}${context.nativeName ? ` (${context.nativeName})` : ''}`);
    if (context.location) contextParts.push(`Location: ${context.location}${context.state ? `, ${context.state}` : ''}`);
    if (context.dynasty) contextParts.push(`Dynasty/Patron: ${context.dynasty}${context.ruler ? ` — ruled by ${context.ruler}` : ''}`);
    if (context.historicalPeriod) contextParts.push(`Historical Period: ${context.historicalPeriod}`);
    if (context.architecturalStyle) contextParts.push(`Architectural Style: ${context.architecturalStyle}`);
    if (context.constructionMaterial) contextParts.push(`Construction Material: ${context.constructionMaterial}`);
    if (context.culturalSignificance) contextParts.push(`Cultural Significance: ${context.culturalSignificance}`);
    if (context.historicalChronicle) contextParts.push(`Historical Chronicle: ${context.historicalChronicle}`);
    if (context.selectedFeature) contextParts.push(`Currently Focused Feature: ${context.selectedFeature}`);

    const contextBlock = contextParts.length > 0
      ? `=== MONUMENT CONTEXT ===\n${contextParts.join('\n')}\n========================\n\n`
      : '';

    // ── Build Gemini contents array (conversation history aware) ──────────
    // Keep last 12 turns max (~6 exchanges) to stay within reasonable limits
    const recentHistory = conversationHistory.slice(-12);
    const contents = [];

    if (recentHistory.length === 0) {
      // Single-turn: inject system + context into user message
      contents.push({
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\n${contextBlock}User question: ${message.trim()}` }]
      });
    } else {
      // Multi-turn: prepend system + context to first history turn
      const [first, ...rest] = recentHistory;
      contents.push({
        role: first.role,
        parts: [{ text: `${systemInstruction}\n\n${contextBlock}${first.parts[0].text}` }]
      });
      for (const turn of rest) {
        contents.push(turn);
      }
      // Append new user message
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }]
      });
    }

    // ── Call Gemini ────────────────────────────────────────────────────────
    console.log(`[AI Chat] Sending request to Gemini. Monument: "${context.monument || 'none'}". Message: "${message.trim().substring(0, 80)}"`);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: mode === 'researcher' ? 2000 : 1500,
            topP: 0.9
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[AI Chat] Gemini API responded with ${geminiRes.status}:`, errText);
      return res.status(502).json({
        success: false,
        error: `Dharohar AI could not complete the request (status ${geminiRes.status}). Check server logs for details.`
      });
    }

    const geminiData = await geminiRes.json();
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error('[AI Chat] Gemini returned empty response:', JSON.stringify(geminiData));
      return res.status(502).json({
        success: false,
        error: 'Dharohar AI returned an empty response. Please try again.'
      });
    }

    console.log(`[AI Chat] Gemini responded successfully (${responseText.length} chars).`);

    return res.json({
      success: true,
      message: responseText.trim()
    });

  } catch (err) {
    console.error('[AI Chat] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred. Please try again.'
    });
  }
});

app.listen(PORT, () => {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!geminiKey) {
    console.warn('[DHAROHAR] ⚠️  WARNING: No Gemini API key found. Set GEMINI_API_KEY in .env. AI Chat will not work.');
  } else {
    console.log('[DHAROHAR] ✅ Gemini API key loaded successfully.');
  }
  console.log(`DHAROHAR API Proxy running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM = `You are iDuck, a friendly, curious robot duck and a warm learning companion.
Personality: playful, encouraging, optimistic, a little witty. You love learning and helping people learn new things.
Rules:
- Reply in English only.
- Keep replies short and natural for speaking aloud: 1-3 short sentences, simple words (your reply is read by text-to-speech).
- Plain conversational text only. No markdown, no emoji, no bullet lists.
- Be kind, warm, and age-appropriate.
- If you don't know something, say so cheerfully and offer to explore it together.`;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) =>
  res.json({ ok: true, service: 'iDuck Cloud', model: MODEL }));

app.post('/chat', async (req, res) => {
  try {
    const text = (req.body && req.body.text ? String(req.body.text) : '').trim();
    if (!text) return res.status(400).json({ error: 'missing text' });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: text,
      config: {
        systemInstruction: SYSTEM,
        temperature: 0.8,
        maxOutputTokens: 600,
        thinkingConfig: { thinkingBudget: 0 },
        tools: [{ googleSearch: {} }],
      },
    });
    const reply = (result.text || '').trim() || "Quack! I didn't quite catch that.";
    res.json({ reply });
  } catch (e) {
    console.error('chat error:', e);
    res.status(500).json({ error: 'chat failed', detail: String((e && e.message) || e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('iDuck Cloud listening on ' + PORT));

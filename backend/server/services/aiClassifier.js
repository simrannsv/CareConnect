import { z } from 'zod';
import Category from '../models/Category.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

const resultSchema = z.object({
  category: z.string().nullable().optional(),
  skills: z.array(z.string()).default([]),
  urgency: z.enum(['low', 'medium', 'high']).catch('medium'),
});

const buildPrompt = (names) =>
  `You classify home service requests for a marketplace.
Available categories: ${names.join(', ')}.
Reply with ONLY a JSON object in this shape:
{"category": "<exact name from the list, or null if none fits>", "skills": ["2 to 5 short lowercase skills needed for the job"], "urgency": "low" | "medium" | "high"}
Urgency is "high" for safety risks or damage in progress (gas leak, sparks, burning smell, flooding, no power at all), "low" for cosmetic or planned work, otherwise "medium".`;

// returns { category: ObjectId | null, skills: string[], urgency } or null when AI is unavailable
export const classifyRequest = async (description) => {
  if (!process.env.GROQ_API_KEY) return null;

  const categories = await Category.find({ isActive: true }).select('name');
  if (categories.length === 0) return null;

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildPrompt(categories.map((c) => c.name)) },
        { role: 'user', content: description },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq responded with ${res.status}`);

  const data = await res.json();
  const parsed = resultSchema.parse(JSON.parse(data.choices[0].message.content));

  const match = categories.find(
    (c) => c.name.toLowerCase() === (parsed.category || '').trim().toLowerCase()
  );
  const skills = [
    ...new Set(parsed.skills.map((s) => s.trim().toLowerCase()).filter(Boolean)),
  ].slice(0, 5);

  return { category: match ? match._id : null, skills, urgency: parsed.urgency };
};

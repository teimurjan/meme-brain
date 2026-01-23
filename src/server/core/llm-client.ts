import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import type { LLMGeneratedContent, MemeSource, HumorProfile } from '../../shared/types';
import { config } from '../config';

const HumorProfileSchema = z.object({
  absurdist: z.number().min(0).max(1),
  sarcastic: z.number().min(0).max(1),
  wholesome: z.number().min(0).max(1),
  unhinged: z.number().min(0).max(1),
  deadpan: z.number().min(0).max(1),
});

const ChallengeContentSchema = z.object({
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        humor_profile: HumorProfileSchema,
        label: z.string(),
        roast: z.string(),
      })
    )
    .length(3),
  moderation_flags: z.array(z.string()),
});

type LLMResult =
  | { success: true; content: LLMGeneratedContent }
  | { success: false; error: string };

function buildSystemPrompt(): string {
  return `You are a veteran Reddit shitposter generating content for "meme-brain" - a game where users pick hilariously wrong interpretations of memes.

HUMOR TYPES (each option must have 2-3 non-zero values, 0-1 scale):
- absurdist: Surreal, random, makes no logical sense
- sarcastic: Dry wit, ironic observations, passive-aggressive
- wholesome: Unexpectedly sweet, earnest, pure-hearted interpretations
- unhinged: Chaotic, unhinged energy, chronically online
- deadpan: Flat, literal, missing the joke entirely

HUMOR GUIDELINES - THIS IS CRITICAL:
- Channel peak Reddit energy: self-deprecating, absurdist, terminally online
- Reference Reddit culture naturally: "touches grass", "least deranged X", "average Y enjoyer", "skill issue"
- Options should make people exhale through their nose, not just smile
- Think r/me_irl meets r/shitposting meets r/196
- Every option should feel like something that would get 2k upvotes as a comment

CONTENT BOUNDARIES:
- No hate speech, slurs, sexual content, self-harm, doxxing
- Avoid current politics, real individuals, ongoing tragedies
- Roast-y labels are good, cruel ones are not

LENGTH LIMITS:
- option text: max 90 chars each
- label: max 26 chars (funny 2-3 word title for this interpretation)
- roast: max 140 chars (1-2 line roast of someone who'd pick this)

Return moderation_flags as empty array unless borderline.`;
}

function buildUserPrompt(postId: string, meme: MemeSource): string {
  return `Post ID: ${postId} | From r/${meme.subreddit} | Title: "${meme.title}"

LOOK AT THE IMAGE CAREFULLY. Generate THREE funny wrong interpretations.

Each option needs:
1. TEXT (max 90 chars) - A hilariously wrong take on the meme
   - Reference specific visual elements from the meme
   - Sound like a comment that would get ratio'd for being confidently wrong
   - Be funny in how wrong it is, not just wrong

2. HUMOR_PROFILE - 5 values (0-1), 2-3 should be non-zero
   Example: { absurdist: 0.8, sarcastic: 0, wholesome: 0.3, unhinged: 0.7, deadpan: 0 }

3. LABEL (max 26 chars) - Funny title for this interpretation
   Like: "Reply Guy Supreme", "Certified Yapper", "Lore Understander"

4. ROAST (max 140 chars) - 1-2 sentence roast of someone who'd pick this
   Should feel like a zodiac roast for internet people

Make all three options distinct flavors of wrongness.`;
}

export async function generateContent(
  postId: string,
  meme: MemeSource,
  previousError?: string
): Promise<LLMResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'OpenAI API key not configured' };
  }

  try {
    console.log(`[llm] Generating content with image: ${meme.imageUrl}`);

    const textPrompt = previousError
      ? `${buildUserPrompt(postId, meme)}\n\nPREVIOUS ERROR: ${previousError}\nPlease fix the issue and try again.`
      : buildUserPrompt(postId, meme);

    const openai = createOpenAI({ apiKey });
    const { object } = await generateObject({
      model: openai(config.llm.model),
      schema: ChallengeContentSchema,
      system: buildSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: new URL(meme.imageUrl) },
            { type: 'text', text: textPrompt },
          ],
        },
      ],
      temperature: 0.8,
    });

    console.log('[llm] Generated content successfully');

    const content: LLMGeneratedContent = {
      moderationFlags: object.moderation_flags,
      options: object.options.map((o, index) => ({
        id: ['A', 'B', 'C'][index] as 'A' | 'B' | 'C',
        text: o.text,
        humorProfile: o.humor_profile as HumorProfile,
        result: {
          label: o.label,
          roast: o.roast,
        },
      })) as [
        LLMGeneratedContent['options'][0],
        LLMGeneratedContent['options'][0],
        LLMGeneratedContent['options'][0],
      ],
    };

    return { success: true, content };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown LLM error';
    console.error('[llm] Generation failed:', message);
    return { success: false, error: message };
  }
}

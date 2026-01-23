import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import type { LLMGeneratedContent, MemeSource, GameType } from '../../shared/types';
import { GAME_TYPE_CONFIG } from '../../shared/types';
import { config } from '../config';

const ChallengeContentSchema = z.object({
  situation: z.string(),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        archetype_id: z.string(),
      })
    )
    .length(3),
  archetypes: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        blurb: z.string(),
        share_text: z.string(),
      })
    )
    .length(3),
  moderation_flags: z.array(z.string()),
});

type LLMResult =
  | { success: true; content: LLMGeneratedContent }
  | { success: false; error: string };

const GAME_TYPE_DESCRIPTIONS = {
  wrongMeaning:
    'All three options should confidently misread or take the meme too literally. Think: someone who genuinely misunderstands the joke.',
  wrongTone:
    "All three options should use inappropriate register (legalese, academic jargon, HR-speak, therapy-speak, formal language). Think: someone responding to a meme like it's a business email.",
  wrongFraming:
    'All three options should apply wrong subreddit lens or worldview ("this is r/___ energy"). Think: someone who sees every meme through a specific community\'s perspective.',
} as const;

function buildSystemPrompt(gameType: GameType): string {
  const typeConfig = GAME_TYPE_CONFIG[gameType];
  return `You are a veteran Reddit shitposter generating content for "meme-brain" - a game where users pick hilariously wrong interpretations of memes.

TODAY'S MODE: ${typeConfig.label}
${GAME_TYPE_DESCRIPTIONS[gameType]}

HUMOR GUIDELINES - THIS IS CRITICAL:
- Channel peak Reddit energy: self-deprecating, absurdist, terminally online
- Reference Reddit culture naturally: "touches grass", "least deranged X", "average Y enjoyer", "skill issue"
- Options should make people exhale through their nose, not just smile
- Think r/me_irl meets r/shitposting meets r/196
- Every option should feel like something that would get 2k upvotes as a comment

SITUATION LINE RULES:
- DO NOT describe what's in the meme - users can see it
- Frame it as a relatable scenario: "When you...", "POV:", "Me after...", "This hits different when..."
- Make it specific and absurd, not generic

CONTENT BOUNDARIES:
- No hate speech, slurs, sexual content, self-harm, doxxing
- Avoid current politics, real individuals, ongoing tragedies
- Roast-y archetypes are good, cruel ones are not

LENGTH LIMITS:
- situation: max 140 chars
- option text: max 90 chars each
- archetype label: max 26 chars

ARCHETYPE FORMAT:
- Array of 3 objects with: id (snake_case), label (2-3 words), blurb, share_text
- Each archetype_id in options must match an archetype id
- Blurbs should read like a zodiac roast for internet people
- share_text: what this person would unironically comment

Return moderation_flags as empty array unless borderline.`;
}

function buildUserPrompt(postId: string, meme: MemeSource, gameType: GameType): string {
  const typeConfig = GAME_TYPE_CONFIG[gameType];
  return `Post ID: ${postId} | From r/${meme.subreddit} | Title: "${meme.title}"

LOOK AT THE IMAGE CAREFULLY. Generate:

1. SITUATION (max 140 chars)
   Frame the meme in a relatable context WITHOUT describing it.

   BAD: "A cat sitting on a keyboard" (describes image)
   BAD: "Someone posted a funny meme" (generic)

   GOOD: "POV: you mass-reply 'this' to every post"
   GOOD: "Me explaining to my therapist why I need this"
   GOOD: "When the group chat has been too quiet"

   Make it oddly specific and terminally online.

2. THREE OPTIONS (max 90 chars each) - "${gameType}" style

   All options: ${typeConfig.prompt}

   Each must:
   - Reference specific visual elements from the meme
   - Sound like a comment that would get ratio'd for being confidently wrong
   - Be funny in how wrong it is, not just wrong

   Make them distinct flavors of the same wrongness.

3. THREE ARCHETYPES (one per option)

   Format: { id, label, blurb, share_text }

   - Labels like: "Reply Guy Supreme", "Certified Yapper", "Lore Understander"
   - Blurbs: roast this type of Redditor in 1-2 sentences
   - share_text: something they'd comment unironically

   These should feel like personality quiz results that make you go "damn ok"`;
}

export async function generateContent(
  postId: string,
  meme: MemeSource,
  gameType: GameType,
  previousError?: string
): Promise<LLMResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'OpenAI API key not configured' };
  }

  try {
    console.log(`[llm] Generating content for ${gameType} day with image: ${meme.imageUrl}`);

    const textPrompt = previousError
      ? `${buildUserPrompt(postId, meme, gameType)}\n\nPREVIOUS ERROR: ${previousError}\nPlease fix the issue and try again.`
      : buildUserPrompt(postId, meme, gameType);

    const openai = createOpenAI({ apiKey });
    const { object } = await generateObject({
      model: openai(config.llm.model),
      schema: ChallengeContentSchema,
      system: buildSystemPrompt(gameType),
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

    const archetypesRecord: Record<string, { label: string; blurb: string; shareText: string }> =
      {};
    for (const arch of object.archetypes) {
      archetypesRecord[arch.id] = {
        label: arch.label,
        blurb: arch.blurb,
        shareText: arch.share_text,
      };
    }

    for (const option of object.options) {
      if (!(option.archetype_id in archetypesRecord)) {
        return {
          success: false,
          error: `Archetype ${option.archetype_id} referenced but not defined`,
        };
      }
    }

    const content: LLMGeneratedContent = {
      situation: object.situation,
      archetypes: archetypesRecord,
      moderationFlags: object.moderation_flags,
      options: object.options.map((o, index) => ({
        id: ['A', 'B', 'C'][index] as 'A' | 'B' | 'C',
        text: o.text,
        archetypeId: o.archetype_id,
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

import type { Challenge, MemeSource, LLMGeneratedContent } from '../../shared/types';
import { generateSeed } from '../../shared/utils/date';
import { config } from '../config';
import {
  getChallenge,
  setChallenge,
  acquireLock,
  releaseLock,
  waitForChallenge,
} from '../storage/challenge-store';
import { getFallbackChallenge } from './fallback-challenges';
import { fetchMeme } from './meme-fetcher';
import { generateContent } from './llm-client';

export async function getOrGenerateChallenge(postId: string): Promise<Challenge | null> {
  console.log(`[challenge] Getting challenge for post ${postId}`);

  const existing = await getChallenge(postId);
  if (existing) {
    console.log(`[challenge] Using cached challenge from ${existing.moderation.source}`);
    return existing;
  }

  console.log('[challenge] No cached challenge, acquiring lock...');
  const acquired = await acquireLock(postId);
  if (!acquired) {
    console.log('[challenge] Lock not acquired, waiting for another process...');
    return waitForChallenge(postId);
  }

  try {
    const doubleCheck = await getChallenge(postId);
    if (doubleCheck) {
      console.log('[challenge] Challenge appeared while waiting for lock');
      return doubleCheck;
    }

    console.log('[challenge] Generating new challenge...');
    const challenge = await generateChallenge(postId);
    await setChallenge(challenge);
    console.log(`[challenge] New challenge saved (source: ${challenge.moderation.source})`);
    return challenge;
  } finally {
    await releaseLock(postId);
  }
}

async function generateChallenge(postId: string): Promise<Challenge> {
  const seed = generateSeed(`${postId}-${Date.now()}`);
  console.log(`[challenge] seed: ${seed}`);

  const fallbackChallenge = getFallbackChallenge(postId);

  const memeResult = await fetchMeme(seed);
  if (!memeResult.success) {
    console.warn(`Meme fetch failed: ${memeResult.error}, using fallback`);
  }

  const meme = memeResult.success ? memeResult.meme : fallbackChallenge.meme;

  const llmContent = await generateWithRetry(postId, meme);
  if (!llmContent) {
    console.warn('LLM generation failed after retries, using fallback');
    return { ...fallbackChallenge, meme };
  }

  return buildChallenge(postId, seed, meme, llmContent);
}

async function generateWithRetry(
  postId: string,
  meme: MemeSource
): Promise<LLMGeneratedContent | null> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= config.llm.maxRetries; attempt++) {
    console.log(`LLM generation attempt ${attempt}/${config.llm.maxRetries}`);

    const result = await generateContent(postId, meme, lastError);

    if (!result.success) {
      console.warn(`LLM call failed: ${result.error}`);
      lastError = result.error;
      continue;
    }

    return result.content;
  }

  return null;
}

function buildChallenge(
  postId: string,
  seed: string,
  meme: MemeSource,
  content: LLMGeneratedContent
): Challenge {
  return {
    postId,
    seed,
    generatedAt: new Date().toISOString(),
    model: {
      provider: config.llm.provider,
      name: config.llm.model,
    },
    meme,
    options: content.options,
    moderation: {
      safe: true,
      flags: content.moderationFlags || [],
      source: 'llm',
    },
  };
}

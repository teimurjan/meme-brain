import { reddit } from '@devvit/web/server';
import type { MemeSource } from '../../shared/types';
import { config } from '../config';

type FetchResult = { success: true; meme: MemeSource } | { success: false; error: string };

export async function fetchMeme(seed: string): Promise<FetchResult> {
  console.log('[meme-fetcher] Starting fetch with seed:', seed);
  const subreddits = config.meme.subredditAllowlist;
  const seedNum = parseInt(seed, 36) || 0;
  const shuffledSubs = shuffleWithSeed(subreddits, seedNum);
  console.log('[meme-fetcher] Will try subreddits:', shuffledSubs.slice(0, 3));

  for (const subreddit of shuffledSubs) {
    try {
      console.log(`[meme-fetcher] Trying r/${subreddit}...`);
      const result = await fetchFromSubreddit(subreddit, seedNum);
      if (result.success) {
        console.log('[meme-fetcher] Found meme:', result.meme.title);
        return result;
      }
      console.log(`[meme-fetcher] No suitable posts in r/${subreddit}`);
    } catch (err) {
      console.error(`[meme-fetcher] Error fetching from r/${subreddit}:`, err);
    }
  }

  console.log('[meme-fetcher] No meme found in any subreddit');
  return { success: false, error: 'No suitable meme found in any subreddit' };
}

async function fetchFromSubreddit(subredditName: string, seed: number): Promise<FetchResult> {
  console.log(`[meme-fetcher] Fetching top posts from r/${subredditName}...`);
  const posts = await reddit
    .getTopPosts({
      subredditName,
      timeframe: 'day',
      limit: 50,
    })
    .all();

  console.log(`[meme-fetcher] Got ${posts.length} posts from r/${subredditName}`);

  const candidates = posts.filter((post) => {
    if (post.nsfw && !config.safety.nsfw) return false;
    if (post.spoiler && !config.safety.spoilers) return false;
    if (post.score < config.meme.minScore) return false;
    if (!isImagePost(post.url)) return false;
    if (containsDenylistWord(post.title)) return false;
    return true;
  });

  console.log(
    `[meme-fetcher] ${candidates.length} candidates after filtering (min score: ${config.meme.minScore})`
  );

  if (candidates.length === 0) {
    return { success: false, error: `No suitable posts in r/${subredditName}` };
  }

  const selectedIndex = seed % candidates.length;
  const selected = candidates[selectedIndex]!;

  return {
    success: true,
    meme: {
      postId: selected.id,
      subreddit: selected.subredditName,
      title: selected.title.slice(0, config.meme.maxTitleLength),
      imageUrl: selected.url,
      permalink: selected.permalink,
      author: selected.authorName,
    },
  };
}

function isImagePost(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUrl = url.toLowerCase();

  for (const ext of imageExtensions) {
    if (lowerUrl.includes(ext)) return true;
  }

  for (const domain of config.meme.preferredDomains) {
    if (lowerUrl.includes(domain)) return true;
  }

  return false;
}

function containsDenylistWord(text: string): boolean {
  const lowerText = text.toLowerCase();
  for (const word of config.safety.hardDenylist) {
    if (lowerText.includes(word.toLowerCase())) return true;
  }
  for (const word of config.safety.softDenylist) {
    if (lowerText.includes(word.toLowerCase())) return true;
  }
  return false;
}

function shuffleWithSeed<T>(array: readonly T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;

  for (let i = result.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
}

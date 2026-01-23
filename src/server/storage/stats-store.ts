import { redis } from '@devvit/web/server';
import type { PostStats } from '../../shared/types';
import { config } from '../config';

export async function getPostStats(postId: string): Promise<PostStats> {
  const key = config.redis.keys.stats(postId);
  const data = await redis.hGetAll(key);

  if (!data || Object.keys(data).length === 0) {
    return {
      postId,
      total: 0,
      countsByArchetype: {},
    };
  }

  const total = parseInt(data.total || '0', 10);
  const countsByArchetype: Record<string, number> = {};

  for (const [field, value] of Object.entries(data)) {
    if (field !== 'total' && field !== 'postId') {
      countsByArchetype[field] = parseInt(value, 10);
    }
  }

  return { postId, total, countsByArchetype };
}

export async function incrementStat(postId: string, archetypeId: string): Promise<PostStats> {
  const key = config.redis.keys.stats(postId);

  await Promise.all([redis.hIncrBy(key, 'total', 1), redis.hIncrBy(key, archetypeId, 1)]);

  return getPostStats(postId);
}

export async function getArchetypePercentage(
  postId: string,
  archetypeId: string
): Promise<{ total: number; percentage: number }> {
  const stats = await getPostStats(postId);
  const count = stats.countsByArchetype[archetypeId] || 0;
  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
  return { total: stats.total, percentage };
}

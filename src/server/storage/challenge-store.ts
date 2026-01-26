import { redis } from '@devvit/web/server';
import type { Challenge } from '../../shared/types';
import { config } from '../config';

export async function getChallenge(postId: string): Promise<Challenge | null> {
  const key = config.redis.keys.challenge(postId);
  const data = await redis.get(key);
  if (!data) return null;
  return JSON.parse(data) as Challenge;
}

export async function setChallenge(challenge: Challenge): Promise<void> {
  const key = config.redis.keys.challenge(challenge.postId);
  await redis.set(key, JSON.stringify(challenge));
  await redis.expire(key, config.redis.challengeTtlSeconds);
}

export async function acquireLock(postId: string): Promise<boolean> {
  const key = config.redis.keys.challengeLock(postId);
  const expiration = new Date(Date.now() + config.redis.lockTtlSeconds * 1000);
  const result = await redis.set(key, '1', { nx: true, expiration });
  return result === 'OK';
}

export async function releaseLock(postId: string): Promise<void> {
  const key = config.redis.keys.challengeLock(postId);
  await redis.del(key);
}

export async function deleteChallenge(postId: string): Promise<void> {
  const key = config.redis.keys.challenge(postId);
  await redis.del(key);
}

export async function waitForChallenge(
  postId: string,
  maxWaitMs: number = 5000,
  intervalMs: number = 200
): Promise<Challenge | null> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    const challenge = await getChallenge(postId);
    if (challenge) return challenge;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return null;
}

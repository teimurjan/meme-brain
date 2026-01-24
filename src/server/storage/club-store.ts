import { redis, reddit, context } from '@devvit/web/server';
import type { ClubMember, ClubState, LuckyNumber } from '../../shared/types';
import { LUCKY_NUMBERS } from '../../shared/types';
import { config } from '../config';

export async function getGlobalPlayCount(): Promise<number> {
  const key = config.redis.keys.globalPlayCount();
  const count = await redis.get(key);
  return count ? parseInt(count, 10) : 0;
}

export async function incrementGlobalPlayCount(): Promise<number> {
  const key = config.redis.keys.globalPlayCount();
  const newCount = await redis.incrBy(key, 1);
  return newCount;
}

export async function getAllClubMembers(): Promise<Partial<Record<LuckyNumber, ClubMember>>> {
  const key = config.redis.keys.clubMembers();
  const members: Partial<Record<LuckyNumber, ClubMember>> = {};

  for (const num of LUCKY_NUMBERS) {
    const data = await redis.hGet(key, String(num));
    if (data) {
      members[num] = JSON.parse(data) as ClubMember;
    }
  }

  return members;
}

export async function getClubState(): Promise<ClubState> {
  const [globalPlayCount, members] = await Promise.all([getGlobalPlayCount(), getAllClubMembers()]);

  return { globalPlayCount, members };
}

function isLuckyNumber(num: number): num is LuckyNumber {
  return (LUCKY_NUMBERS as readonly number[]).includes(num);
}

export async function resetClubState(): Promise<void> {
  const countKey = config.redis.keys.globalPlayCount();
  const membersKey = config.redis.keys.clubMembers();

  await redis.del(countKey);
  await redis.del(membersKey);
}

export async function checkAndClaimLuckySpot(
  playNumber: number,
  username: string
): Promise<ClubMember | null> {
  if (!isLuckyNumber(playNumber)) {
    return null;
  }

  const key = config.redis.keys.clubMembers();
  const existing = await redis.hGet(key, String(playNumber));
  if (existing) {
    return null;
  }

  let snoovatarUrl: string | null = null;
  try {
    snoovatarUrl = (await reddit.getSnoovatarUrl(username)) ?? null;
  } catch {
    // snoovatar not available, that's fine
  }

  const subredditName = context.subredditName ?? 'unknown';

  const member: ClubMember = {
    luckyNumber: playNumber,
    username,
    snoovatarUrl,
    subredditName,
    claimedAt: new Date().toISOString(),
  };

  await redis.hSet(key, { [String(playNumber)]: JSON.stringify(member) });

  return member;
}

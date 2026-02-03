import { redis, reddit, context } from '@devvit/web/server';
import type { ClubMember, ClubState, LuckyNumber } from '../../shared/types';
import { LUCKY_NUMBERS } from '../../shared/types';
import { config } from '../config';
import { getCycleKey } from '../../shared/utils/date';
import { getUserState, calculateAccumulatedProfile } from './user-store';

export async function getDailyPlayCount(): Promise<number> {
  const dateKey = getCycleKey();
  const key = config.redis.keys.dailyPlayCount(dateKey);
  const count = await redis.get(key);
  return count ? parseInt(count, 10) : 0;
}

export async function incrementDailyPlayCount(): Promise<number> {
  const dateKey = getCycleKey();
  const key = config.redis.keys.dailyPlayCount(dateKey);
  const newCount = await redis.incrBy(key, 1);
  await redis.expire(key, config.redis.dailyTtlSeconds);
  return newCount;
}

export async function getDailyClubMembers(): Promise<Partial<Record<LuckyNumber, ClubMember>>> {
  const dateKey = getCycleKey();
  const key = config.redis.keys.dailyClub(dateKey);
  const members: Partial<Record<LuckyNumber, ClubMember>> = {};

  const memberPromises = LUCKY_NUMBERS.map(async (num) => {
    const data = await redis.hGet(key, String(num));
    if (!data) return null;

    const member = JSON.parse(data) as ClubMember;
    const userState = await getUserState(member.username);
    const humorProfile = calculateAccumulatedProfile(userState.history);

    return { num, member: { ...member, humorProfile } };
  });

  const results = await Promise.all(memberPromises);
  for (const result of results) {
    if (result) {
      members[result.num] = result.member;
    }
  }

  return members;
}

export async function getClubState(): Promise<ClubState> {
  const [todayPlayCount, members] = await Promise.all([getDailyPlayCount(), getDailyClubMembers()]);

  return { todayPlayCount, members };
}

function isLuckyNumber(num: number): num is LuckyNumber {
  return (LUCKY_NUMBERS as readonly number[]).includes(num);
}

export async function resetClubState(): Promise<void> {
  const dateKey = getCycleKey();
  const countKey = config.redis.keys.dailyPlayCount(dateKey);
  const membersKey = config.redis.keys.dailyClub(dateKey);

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

  const dateKey = getCycleKey();
  const key = config.redis.keys.dailyClub(dateKey);
  const existing = await redis.hGet(key, String(playNumber));
  if (existing) {
    return null;
  }

  let snoovatarUrl: string | null = null;
  let displayName: string | undefined;
  let about: string | undefined;
  let accountCreatedAt: string | undefined;
  let linkKarma: number | undefined;
  let commentKarma: number | undefined;

  try {
    const user = await reddit.getUserByUsername(username);
    if (user) {
      snoovatarUrl = (await user.getSnoovatarUrl()) ?? null;
      displayName = user.displayName;
      about = user.about;
      accountCreatedAt = user.createdAt.toISOString();
      linkKarma = user.linkKarma;
      commentKarma = user.commentKarma;
    }
  } catch {
    try {
      snoovatarUrl = (await reddit.getSnoovatarUrl(username)) ?? null;
    } catch {
      // snoovatar not available, that's fine
    }
  }

  const subredditName = context.subredditName ?? 'unknown';

  const member: ClubMember = {
    luckyNumber: playNumber,
    username,
    snoovatarUrl,
    subredditName,
    claimedAt: new Date().toISOString(),
    displayName,
    about,
    accountCreatedAt,
    linkKarma,
    commentKarma,
  };

  await redis.hSet(key, { [String(playNumber)]: JSON.stringify(member) });
  await redis.expire(key, config.redis.dailyTtlSeconds);

  return member;
}

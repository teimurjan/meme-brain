import type { Request, Response } from 'express';
import { redis, reddit, context } from '@devvit/web/server';
import { config } from '../config';
import { getCycleKey } from '../../shared/utils/date';

type DebugResetResponse = {
  type: 'debug-reset';
  success: boolean;
  message: string;
};

export async function handleDebugReset(
  _req: Request,
  res: Response<DebugResetResponse>
): Promise<void> {
  try {
    const deletedKeys: string[] = [];
    const dateKey = getCycleKey();
    const postId = context.postId;

    const dailyPlayKey = config.redis.keys.dailyPlayCount(dateKey);
    await redis.del(dailyPlayKey);
    deletedKeys.push(dailyPlayKey);

    const dailyClubKey = config.redis.keys.dailyClub(dateKey);
    await redis.del(dailyClubKey);
    deletedKeys.push(dailyClubKey);

    const username = await reddit.getCurrentUsername();
    if (username) {
      const userStateKey = config.redis.keys.userState(username);
      await redis.del(userStateKey);
      deletedKeys.push(userStateKey);
    }

    if (postId) {
      const challengeKey = config.redis.keys.challenge(postId);
      const challengeLockKey = config.redis.keys.challengeLock(postId);
      await redis.del(challengeKey);
      await redis.del(challengeLockKey);
      deletedKeys.push(challengeKey, challengeLockKey);
    }

    res.json({
      type: 'debug-reset',
      success: true,
      message: `Reset: ${deletedKeys.join(', ')}`,
    });
  } catch (error) {
    console.error('Error in handleDebugReset:', error);
    res.status(500).json({
      type: 'debug-reset',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

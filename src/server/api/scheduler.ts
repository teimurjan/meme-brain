import type { Request, Response } from 'express';
import { getOrGenerateChallenge } from '../core/challenge-generator';
import { context } from '@devvit/web/server';

export async function handleDailyPostCreate(_req: Request, res: Response): Promise<void> {
  try {
    const postId = context.postId;
    if (!postId) {
      res.status(400).json({ type: 'error', message: 'No post context available' });
      return;
    }
    console.log(`[scheduler] Post created with id ${postId}, pre-generating challenge...`);
    await getOrGenerateChallenge(postId);

    console.log(`[scheduler] Challenge pre-generated successfully for post ${postId}`);

    res.json({
      status: 'success',
      message: `Post created with id ${postId} and challenge pre-generated`,
      postId,
    });
  } catch (error) {
    console.error(`[scheduler] Error in daily post creation: ${error}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create daily post',
    });
  }
}

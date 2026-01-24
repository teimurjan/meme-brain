import type { Request, Response } from 'express';
import { reddit, context } from '@devvit/web/server';
import { resetPostPlay } from '../storage/user-store';
import { deleteChallenge } from '../storage/challenge-store';
import { resetClubState } from '../storage/club-store';

type ResetResponse = {
  type: 'reset';
  success: boolean;
  message: string;
};

type ResetRequest = {
  clearChallenge?: boolean;
  clearClub?: boolean;
};

export async function handleReset(
  req: Request<unknown, unknown, ResetRequest>,
  res: Response<ResetResponse>
): Promise<void> {
  try {
    const postId = context.postId;
    if (!postId) {
      res.status(400).json({ type: 'reset', success: false, message: 'No post context' });
      return;
    }

    const username = await reddit.getCurrentUsername();
    const userId = username ?? 'anonymous';
    const clearChallenge = req.body?.clearChallenge ?? false;
    const clearClub = req.body?.clearClub ?? false;

    await resetPostPlay(userId, postId);

    if (clearChallenge) {
      await deleteChallenge(postId);
    }

    if (clearClub) {
      await resetClubState();
    }

    const parts = ['Play state reset'];
    if (clearChallenge) parts.push('challenge reset');
    if (clearClub) parts.push('club reset');

    res.json({
      type: 'reset',
      success: true,
      message: parts.join(', '),
    });
  } catch (error) {
    console.error('Error in handleReset:', error);
    res.status(500).json({
      type: 'reset',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

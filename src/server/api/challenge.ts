import type { Request, Response } from 'express';
import type { ChallengeResponse, ErrorResponse } from '../../shared/types';
import { reddit, context } from '@devvit/web/server';
import { getUserState, getSelectedOption, hasPlayedChallenge } from '../storage/user-store';
import { getClubState } from '../storage/club-store';
import { getOrGenerateChallenge } from '../core/challenge-generator';

export async function handleGetChallenge(
  _req: Request,
  res: Response<ChallengeResponse | ErrorResponse>
): Promise<void> {
  try {
    const postId = context.postId;
    if (!postId) {
      res.status(400).json({ type: 'error', message: 'No post context available' });
      return;
    }

    const username = await reddit.getCurrentUsername();
    const userId = username ?? 'anonymous';

    const challenge = await getOrGenerateChallenge(postId);
    if (!challenge) {
      res.status(500).json({ type: 'error', message: 'Failed to load challenge' });
      return;
    }

    const userState = await getUserState(userId);
    const hasPlayed = await hasPlayedChallenge(userId, postId, challenge.generatedAt);
    const selectedOptionId = hasPlayed ? await getSelectedOption(userId, postId) : undefined;
    const clubState = await getClubState();

    const response: ChallengeResponse = {
      type: 'challenge',
      challenge,
      userState,
      hasPlayed,
      clubState,
    };
    if (selectedOptionId) {
      response.selectedOptionId = selectedOptionId;
    }
    res.json(response);
  } catch (error) {
    console.error('Error in handleGetChallenge:', error);
    res.status(500).json({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

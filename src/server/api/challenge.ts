import type { Request, Response } from 'express';
import type { ChallengeResponse, ErrorResponse } from '../../shared/types';
import { reddit, context } from '@devvit/web/server';
import { getUserState, getSelectedOption } from '../storage/user-store';
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
    const hasPlayed = userState.lastPlayedPost === postId;

    let selectedOptionId: ChallengeResponse['selectedOptionId'];
    if (hasPlayed) {
      const archetypeId = await getSelectedOption(userId, postId);
      if (archetypeId) {
        const option = challenge.options.find((o) => o.archetypeId === archetypeId);
        selectedOptionId = option?.id;
      }
    }

    const response: ChallengeResponse = {
      type: 'challenge',
      challenge,
      userState,
      hasPlayed,
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

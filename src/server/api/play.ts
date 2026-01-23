import type { Request, Response } from 'express';
import type { PlayRequest, PlayResponse, ErrorResponse, OptionId } from '../../shared/types';
import { reddit, context } from '@devvit/web/server';
import { getChallenge } from '../storage/challenge-store';
import {
  recordPlay,
  hasPlayedPost,
  calculateStrike,
  calculateAccumulatedProfile,
} from '../storage/user-store';
import { formatShareText } from '../../shared/utils/share-text';

const VALID_OPTION_IDS: OptionId[] = ['A', 'B', 'C'];

function isValidOptionId(id: unknown): id is OptionId {
  return typeof id === 'string' && VALID_OPTION_IDS.includes(id as OptionId);
}

export async function handlePlay(
  req: Request<unknown, unknown, PlayRequest>,
  res: Response<PlayResponse | ErrorResponse>
): Promise<void> {
  try {
    const { optionId } = req.body;

    if (!isValidOptionId(optionId)) {
      res.status(400).json({ type: 'error', message: 'Invalid option ID' });
      return;
    }

    const postId = context.postId;
    if (!postId) {
      res.status(400).json({ type: 'error', message: 'No post context available' });
      return;
    }

    const username = await reddit.getCurrentUsername();
    const userId = username ?? 'anonymous';

    const alreadyPlayed = await hasPlayedPost(userId, postId);
    if (alreadyPlayed) {
      res.status(400).json({ type: 'error', message: 'Already played this challenge' });
      return;
    }

    const challenge = await getChallenge(postId);
    if (!challenge) {
      res.status(404).json({ type: 'error', message: 'No challenge found' });
      return;
    }

    const selectedOption = challenge.options.find((o) => o.id === optionId);
    if (!selectedOption) {
      res.status(400).json({ type: 'error', message: 'Option not found' });
      return;
    }

    const userState = await recordPlay(userId, postId, optionId, selectedOption.humorProfile);

    const strike = calculateStrike(userState.history);
    const humorProfile = calculateAccumulatedProfile(userState.history);
    const shareText = formatShareText(
      selectedOption.result.label,
      selectedOption.result.roast,
      humorProfile,
      strike
    );

    res.json({
      type: 'play',
      optionResult: selectedOption.result,
      optionId,
      strike,
      humorProfile,
      userState,
      shareText,
    });
  } catch (error) {
    console.error('Error in handlePlay:', error);
    res.status(500).json({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

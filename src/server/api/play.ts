import type { Request, Response } from 'express';
import type { PlayRequest, PlayResponse, ErrorResponse, OptionId } from '../../shared/types';
import { reddit, context } from '@devvit/web/server';
import { getChallenge } from '../storage/challenge-store';
import { recordPlay, hasPlayedPost } from '../storage/user-store';
import { incrementStat, getArchetypePercentage } from '../storage/stats-store';

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

    const archetype = challenge.archetypes[selectedOption.archetypeId];
    if (!archetype) {
      res.status(500).json({ type: 'error', message: 'Archetype not found' });
      return;
    }

    const userState = await recordPlay(userId, postId, selectedOption.archetypeId);
    await incrementStat(postId, selectedOption.archetypeId);
    const { total, percentage } = await getArchetypePercentage(postId, selectedOption.archetypeId);

    const shareText = formatShareText(archetype.label, archetype.shareText);

    res.json({
      type: 'play',
      archetype,
      archetypeId: selectedOption.archetypeId,
      stats: { total, percentage },
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

function formatShareText(label: string, blurb: string): string {
  return `meme-brain
I got: ${label}
"${blurb}"
#memebrain`;
}

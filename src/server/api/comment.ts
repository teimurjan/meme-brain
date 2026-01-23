import type { Request, Response } from 'express';
import { reddit, context } from '@devvit/web/server';

export async function handlePostComment(req: Request, res: Response): Promise<void> {
  const postId = context.postId;

  try {
    const { text } = req.body as { text?: string };

    if (!text || typeof text !== 'string') {
      res.status(400).json({ type: 'error', message: 'Missing comment text' });
      return;
    }

    if (!postId) {
      res.status(400).json({ type: 'error', message: 'No post context' });
      return;
    }

    await reddit.submitComment({
      id: postId,
      text,
      runAs: 'USER',
    });
    res.json({ type: 'success' });
  } catch (error) {
    console.error('[comment] Error posting comment on post %s:', postId, error);
    res.status(500).json({
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to post comment',
    });
  }
}

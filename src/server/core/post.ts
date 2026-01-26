import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: '🧠 Meme Brain: How Would You Misread This?',
  });
};

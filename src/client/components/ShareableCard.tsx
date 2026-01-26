import { useState } from 'react';
import { Button } from './ui/Button';

type Props = {
  text: string;
};

type PostStatus = 'idle' | 'posting' | 'posted' | 'error';

export function ShareableCard({ text }: Props) {
  const [status, setStatus] = useState<PostStatus>('idle');

  const handlePost = async () => {
    if (status === 'posting' || status === 'posted') return;

    setStatus('posting');

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { type: 'success' } | { type: 'error'; message: string };
      if (data.type === 'error') throw new Error(data.message);

      setStatus('posted');
    } catch (err) {
      console.error('Failed to post comment:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const buttonText = {
    idle: 'Share Your Humor Profile',
    posting: 'Sharing...',
    posted: 'Shared!',
    error: 'Failed - Try Again',
  }[status];

  return (
    <Button
      className="w-full"
      variant="secondary"
      onClick={handlePost}
      disabled={status === 'posting' || status === 'posted'}
    >
      {buttonText}
    </Button>
  );
}

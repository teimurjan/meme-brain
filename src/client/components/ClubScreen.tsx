import { useState } from 'react';
import type { ClubMember, ClubState } from '../../shared/types';
import { LUCKY_NUMBERS, LUCKY_NUMBER_LORE } from '../../shared/types';
import { MemberDisplay } from './MemberDisplay';
import { Button } from './ui/Button';

type Props = {
  clubState: ClubState;
  myClubMember: ClubMember | null;
  onBack: () => void;
  onViewProfile: (member: ClubMember) => void;
};

type ShareStatus = 'idle' | 'sharing' | 'shared' | 'error';

function formatClubShareText(member: ClubMember): string {
  const lore = LUCKY_NUMBER_LORE[member.luckyNumber];
  return `🏆 I'm player #${member.luckyNumber} in today's 1-42-69 Club!

"${lore.title}" — ${lore.description}

Play Meme Brain and claim your spot 👇

[${import.meta.env.VITE_APP_SUBREDDIT_URL}](${import.meta.env.VITE_APP_SUBREDDIT_URL})`;
}

export function ClubScreen({ clubState, myClubMember, onBack, onViewProfile }: Props) {
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');

  const handleShare = async () => {
    if (!myClubMember || shareStatus === 'sharing' || shareStatus === 'shared') return;

    setShareStatus('sharing');

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formatClubShareText(myClubMember) }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { type: 'success' } | { type: 'error'; message: string };
      if (data.type === 'error') throw new Error(data.message);

      setShareStatus('shared');
    } catch (err) {
      console.error('Failed to share club status:', err);
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 3000);
    }
  };

  const shareButtonText = {
    idle: `I'm #${myClubMember?.luckyNumber} — Flex It`,
    sharing: 'Posting...',
    shared: 'Posted!',
    error: 'Failed - Try Again',
  }[shareStatus];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-200">1-42-69 Club</h1>
        <p className="text-sm text-zinc-200 mt-1">Today's lucky players</p>
      </div>

      <div className="flex flex-col gap-2">
        {LUCKY_NUMBERS.map((num) => (
          <MemberDisplay
            key={num}
            luckyNumber={num}
            clubState={clubState}
            onMemberClick={onViewProfile}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {myClubMember && (
          <Button
            onClick={handleShare}
            disabled={shareStatus === 'sharing' || shareStatus === 'shared'}
            variant="secondary"
            className="w-full"
          >
            {shareButtonText}
          </Button>
        )}

        <Button onClick={onBack} className="w-full">
          ← Back to Results
        </Button>
      </div>
    </div>
  );
}

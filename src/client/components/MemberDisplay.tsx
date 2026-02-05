import { useState } from 'react';
import clsx from 'clsx';
import defaultSnooGray from '../../../assets/default-snoo-gray.png';
import type { ClubMember, ClubState, LuckyNumber } from '../../shared/types';
import { LUCKY_NUMBER_LORE } from '../../shared/types';

export function MemberDisplay({
  luckyNumber,
  clubState,
  onMemberClick,
}: {
  luckyNumber: LuckyNumber;
  clubState: ClubState;
  onMemberClick: (member: ClubMember) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const member = clubState.members[luckyNumber];
  const lore = LUCKY_NUMBER_LORE[luckyNumber];

  return (
    <div className="flex gap-2 items-center border-2 border-black bg-zinc-700 p-2 shadow-[4px_4px_0_0] pr-4 relative">
      <span className="border-2 border-zinc-200 bg-orange-600 text-zinc-200 font-semibold text-center w-10 h-10 flex items-center justify-center text-base absolute -top-3 -right-3">
        #{luckyNumber}
      </span>

      <div
        className={clsx(
          'h-14 w-14 shrink-0',
          !isLoaded && 'border-2 border-zinc-400 bg-transparent'
        )}
      >
        <img
          src={member ? (member.snoovatarUrl ?? defaultSnooGray) : defaultSnooGray}
          alt={member ? `u/${member.username}'s snoovatar` : 'Default snoo'}
          className={clsx('h-14 w-14 object-contain', !isLoaded && 'invisible')}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <span
          className={clsx(
            'font-semibold truncate text-zinc-200',
            member && 'cursor-pointer hover:underline'
          )}
          onClick={member ? () => onMemberClick(member) : undefined}
        >
          {member ? `u/${member.username} ↗` : 'u/???'}
        </span>

        <span className="text-xs text-zinc-300">
          <span className="font-medium">{lore.title}:</span> <span>{lore.description}</span>
        </span>
      </div>
    </div>
  );
}

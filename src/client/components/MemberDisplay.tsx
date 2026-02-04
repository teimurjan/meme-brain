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
  const member = clubState.members[luckyNumber];
  const lore = LUCKY_NUMBER_LORE[luckyNumber];

  return (
    <div className="flex gap-2 items-center border-2 border-black bg-yellow-100 p-2 shadow-[4px_4px_0_0]">
      <span className="bg-black text-yellow-200 font-semibold text-center w-10 h-10 shrink-0 flex items-center justify-center text-lg">
        #{luckyNumber}
      </span>

      <img
        src={member ? (member.snoovatarUrl ?? defaultSnooGray) : defaultSnooGray}
        alt={member ? `u/${member.username}'s snoovatar` : 'Default snoo'}
        className="h-14 w-14 object-contain shrink-0"
      />

      <div className="flex flex-col gap-1 min-w-0">
        <span
          className={clsx(
            'font-semibold truncate',
            member ? 'cursor-pointer hover:underline' : 'text-zinc-800'
          )}
          onClick={member ? () => onMemberClick(member) : undefined}
        >
          {member ? `u/${member.username}` : 'u/???'}
        </span>

        <span className="text-xs text-zinc-800">
          <span className="font-medium">{lore.title}:</span>{' '}
          <span className="text-zinc-700">{lore.description}</span>
        </span>
      </div>
    </div>
  );
}

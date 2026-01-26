import clsx from 'clsx';
import defaultSnooGray from '../../../assets/default-snoo-gray.png';
import type { ClubState, LuckyNumber } from '../../shared/types';
import { LUCKY_NUMBER_LORE } from '../../shared/types';
import { Badge } from './ui/Badge';

const badgeVariant: Record<LuckyNumber, 'success' | 'info' | 'warning'> = {
  1: 'success',
  42: 'info',
  69: 'warning',
};

export function MemberDisplay({
  luckyNumber,
  clubState,
}: {
  luckyNumber: LuckyNumber;
  clubState: ClubState;
}) {
  const member = clubState.members[luckyNumber];
  const lore = LUCKY_NUMBER_LORE[luckyNumber];

  return (
    <div className="flex gap-3 items-center">
      <img
        src={member ? (member.snoovatarUrl ?? defaultSnooGray) : defaultSnooGray}
        alt={member ? `u/${member.username}'s snoovatar` : 'Default snoo'}
        className="h-14 w-14 object-contain shrink-0"
      />

      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant[luckyNumber]}>#{luckyNumber}</Badge>
          <span className={clsx('font-semibold truncate', !member && 'text-gray-500')}>
            {member ? `u/${member.username}` : 'u/???'}
          </span>
        </div>
        <span className="text-sm text-gray-700">
          <span className="font-medium">{lore.title}:</span>{' '}
          <span className="text-gray-500">{lore.description}</span>
        </span>
      </div>
    </div>
  );
}

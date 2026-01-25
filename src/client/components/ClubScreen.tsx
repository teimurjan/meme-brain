import defaultSnooGray from '../../../assets/default-snoo-gray.png';
import type { ClubState, LuckyNumber } from '../../shared/types';
import { LUCKY_NUMBERS, LUCKY_NUMBER_LORE } from '../../shared/types';
import { Button } from './ui/Button';

type Props = {
  clubState: ClubState;
  onBack: () => void;
};

function MemberSlot({
  luckyNumber,
  clubState,
}: {
  luckyNumber: LuckyNumber;
  clubState: ClubState;
}) {
  const member = clubState.members[luckyNumber];
  const lore = LUCKY_NUMBER_LORE[luckyNumber];

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center gap-1 overflow-hidden">
      <span className="text-lg font-bold text-gray-600">#{luckyNumber}</span>

      <img
        src={member ? (member.snoovatarUrl ?? defaultSnooGray) : defaultSnooGray}
        alt={member ? `u/${member.username}'s snoovatar` : 'Default snoo'}
        className="h-20 w-20 object-contain shrink-0"
      />
      <span className="text-xs font-medium truncate max-w-full px-1 text-center">
        {member ? `u/${member.username}` : 'Unclaimed'}
      </span>
      <span className="text-xs text-gray-500 truncate max-w-full px-1">
        {member ? `r/${member.subredditName}` : '?'}
      </span>

      <span className="text-xs font-semibold text-center">{lore.title}</span>
    </div>
  );
}

export function ClubScreen({ clubState, onBack }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">The 1-42-69 Club</h1>
        <p className="text-sm text-gray-600 mt-1">Today's lucky players</p>
        <p className="text-xs text-gray-500 mt-1">
          {clubState.todayPlayCount} plays today · Resets at midnight UTC
        </p>
      </div>

      <div className="flex gap-2">
        {LUCKY_NUMBERS.map((num) => (
          <MemberSlot key={num} luckyNumber={num} clubState={clubState} />
        ))}
      </div>

      <div className="border-2 border-black bg-gray-50 p-4 shadow-[2px_2px_0_0]">
        <h2 className="font-bold mb-2">Why these numbers?</h2>
        <ul className="space-y-2 text-sm">
          {LUCKY_NUMBERS.map((num) => {
            const lore = LUCKY_NUMBER_LORE[num];
            return (
              <li key={num}>
                <span className="font-semibold">
                  #{num} - {lore.title}:
                </span>{' '}
                <span className="text-gray-600">{lore.description}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <Button onClick={onBack} className="w-full">
        ← Back to Results
      </Button>
    </div>
  );
}

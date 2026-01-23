import type { UserState } from '../../shared/types';

type Props = {
  userState: UserState;
};

export function StreakDisplay({ userState }: Props) {
  const { totalPlays, history } = userState;

  return (
    <div className="flex gap-3 justify-center w-full">
      <div className="border-2 border-black bg-blue-100 px-4 py-2 shadow-[2px_2px_0_0] text-center flex-1">
        <div className="text-2xl font-bold text-black">{totalPlays}</div>
        <div className="text-xs font-medium uppercase tracking-wide">Played</div>
      </div>
      <div className="border-2 border-black bg-green-100 px-4 py-2 shadow-[2px_2px_0_0] text-center flex-1">
        <div className="text-2xl font-bold text-black">{history.length}</div>
        <div className="text-xs font-medium uppercase tracking-wide">Recent</div>
      </div>
    </div>
  );
}

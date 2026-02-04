import type { OptionResult, HumorProfile } from '../../shared/types';
import { useNextMemeCountdown } from '../hooks/useNextMemeCountdown';
import { ShareableCard } from './ShareableCard';
import { RadarChart } from './RadarChart';
import { Button } from './ui/Button';
import { isProduction } from '../utils/isProduction';

type Props = {
  optionResult: OptionResult;
  strike: number;
  humorProfile: HumorProfile;
  shareText: string;
  onReset?: (clearChallenge?: boolean) => void;
  onResetClub?: () => void;
  onShowClub: () => void;
};

export function ResultScreen({
  optionResult,
  strike,
  humorProfile,
  shareText,
  onReset,
  onResetClub,
  onShowClub,
}: Props) {
  const countdown = useNextMemeCountdown();

  return (
    <div className="flex flex-col gap-3 max-w-lg mx-auto">
      <div className="border-2 border-black bg-yellow-100 p-2 shadow-[4px_4px_0_0] text-center">
        <p className="text-sm text-gray-600 mb-1">You are</p>
        <h2 className="text-xl font-bold text-black">{optionResult.label}</h2>
        <p className="mt-2 text-sm italic text-gray-600">"{optionResult.roast}"</p>
      </div>

      <div className="flex justify-between items-center">
        {strike > 0 ? (
          <div className="flex items-center gap-1.5">
            <span>🔥</span>
            <span className="text-lg font-bold">{strike}</span>
            <span className="text-sm text-gray-600">day streak</span>
          </div>
        ) : (
          <div />
        )}
        <Button size="sm" onClick={onShowClub}>
          1-42-69 Club →
        </Button>
      </div>

      <RadarChart profile={humorProfile} size={200} />

      <ShareableCard text={shareText} />

      {isProduction() ? (
        <div className="text-center text-sm text-gray-500">
          Next meme in <span className="font-medium">{countdown}</span>
        </div>
      ) : (
        <>
          {onReset && (
            <div className="flex gap-3 justify-center w-full">
              <Button onClick={() => onReset(false)} className="flex-1">
                [DEV] Play Again
              </Button>
              <Button onClick={() => onReset(true)} className="flex-1">
                [DEV] New Challenge
              </Button>
            </div>
          )}
          {onResetClub && (
            <Button onClick={onResetClub} className="w-full">
              [DEV] Reset Club
            </Button>
          )}
        </>
      )}
    </div>
  );
}

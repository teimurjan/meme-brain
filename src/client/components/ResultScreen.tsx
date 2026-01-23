import type { OptionResult, HumorProfile } from '../../shared/types';
import { useNextMemeCountdown } from '../hooks/useNextMemeCountdown';
import { ShareableCard } from './ShareableCard';
import { RadarChart } from './RadarChart';
import { Button } from './ui/Button';

type Props = {
  optionResult: OptionResult;
  strike: number;
  humorProfile: HumorProfile;
  shareText: string;
  onReset?: (clearChallenge?: boolean) => void;
};

export function ResultScreen({ optionResult, strike, humorProfile, shareText, onReset }: Props) {
  const isProduction = import.meta.env.VITE_STAGE === 'production';
  const countdown = useNextMemeCountdown();
  console.log('humorProfile', humorProfile);
  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      <div className="border-2 border-black bg-yellow-100 p-4 shadow-[4px_4px_0_0] text-center">
        <p className="text-sm text-gray-600 mb-1">You are</p>
        <h2 className="text-2xl font-bold text-black">{optionResult.label}</h2>
        <p className="mt-2 text-sm italic text-gray-600">"{optionResult.roast}"</p>
      </div>

      {strike > 0 && (
        <div className="border-2 border-black bg-orange-100 p-3 shadow-[2px_2px_0_0] text-center">
          <span className="text-2xl font-bold text-black">{strike}</span>
          <span className="text-sm text-gray-600 ml-2">day streak</span>
          {strike >= 3 && <span className="ml-1">🔥</span>}
        </div>
      )}

      <RadarChart profile={humorProfile} size={250} />

      <ShareableCard text={shareText} />

      {isProduction ? (
        <div className="text-center text-sm text-gray-500">
          Next meme in <span className="font-medium">{countdown}</span>
        </div>
      ) : (
        onReset && (
          <div className="flex gap-3 justify-center w-full">
            <Button onClick={() => onReset(false)} className="flex-1">
              Play Again
            </Button>
            <Button onClick={() => onReset(true)} className="flex-1">
              New Challenge
            </Button>
          </div>
        )
      )}
    </div>
  );
}

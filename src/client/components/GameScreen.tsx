import type { Challenge, OptionId } from '../../shared/types';
import { MemeDisplay } from './MemeDisplay';
import { OptionButton } from './OptionButton';

type Props = {
  challenge: Challenge;
  onSelect: (id: OptionId) => void;
  isPlaying: boolean;
  selectedOptionId: OptionId | null;
};

export function GameScreen({ challenge, onSelect, isPlaying, selectedOptionId }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <MemeDisplay meme={challenge.meme} />

      <p className="text-sm text-center font-medium text-gray-700">
        Pick the funniest explanation:
      </p>

      <div className="flex flex-col gap-3">
        {challenge.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            onSelect={onSelect}
            disabled={isPlaying}
            selected={selectedOptionId === option.id}
          />
        ))}
      </div>
    </div>
  );
}

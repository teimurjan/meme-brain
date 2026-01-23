import type { Challenge, OptionId } from '../../shared/types';
import { GAME_TYPE_CONFIG } from '../../shared/types';
import { MemeDisplay } from './MemeDisplay';
import { OptionButton } from './OptionButton';

type Props = {
  challenge: Challenge;
  onSelect: (id: OptionId) => void;
  isPlaying: boolean;
  selectedOptionId: OptionId | null;
};

export function GameScreen({ challenge, onSelect, isPlaying, selectedOptionId }: Props) {
  const gameConfig = GAME_TYPE_CONFIG[challenge.gameType];

  return (
    <div className="flex flex-col gap-3 max-w-lg mx-auto">
      <h5 className="text-sm text-center">
        <span className="font-semibold">Hint: </span>
        {gameConfig.prompt}
      </h5>

      <MemeDisplay meme={challenge.meme} />

      <p className="text-sm text-center">
        <span className="font-semibold">Situation: </span>
        {challenge.situation}
      </p>

      <div className="flex flex-col gap-3">
        {challenge.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            gameType={challenge.gameType}
            onSelect={onSelect}
            disabled={isPlaying}
            selected={selectedOptionId === option.id}
          />
        ))}
      </div>
    </div>
  );
}

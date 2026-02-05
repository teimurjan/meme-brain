import type { Challenge, OptionId } from '../../shared/types';
import { MemeDisplay } from './MemeDisplay';
import { OptionButton } from './OptionButton';

type Props = {
  challenge: Challenge;
  selectedOptionId: OptionId;
};

export function MemeReviewScreen({ challenge, selectedOptionId }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <MemeDisplay meme={challenge.meme} />

      <p className="text-sm text-center font-medium text-gray-700">Your pick:</p>

      <div className="flex flex-col gap-3">
        {challenge.options.map((option) => (
          <OptionButton key={option.id} option={option} selected={selectedOptionId === option.id} />
        ))}
      </div>
    </div>
  );
}

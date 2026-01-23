import type { ChallengeOption, OptionId, GameType } from '../../shared/types';
import { Button } from './ui/Button';

type Props = {
  option: ChallengeOption;
  gameType: GameType;
  onSelect: (id: OptionId) => void;
  disabled: boolean;
  selected: boolean;
};

export function OptionButton({ option, onSelect, disabled, selected }: Props) {
  return (
    <Button
      size="sm"
      shadow="lg"
      selected={selected}
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className="block"
    >
      <span className="font-semibold">{option.id}.</span> <span>{option.text}</span>
    </Button>
  );
}

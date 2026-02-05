import type { ChallengeOption, OptionId } from '../../shared/types';
import { Button } from './ui/Button';

type Props = {
  option: ChallengeOption;
  onSelect?: (id: OptionId) => void;
  disabled?: boolean;
  selected?: boolean;
};

export function OptionButton({ option, onSelect, disabled = false, selected = false }: Props) {
  return (
    <Button
      size="sm"
      selected={selected}
      disabled={disabled}
      onClick={() => onSelect?.(option.id)}
      className="block"
    >
      <span className="font-semibold">{option.id}.</span> <span>{option.text}</span>
    </Button>
  );
}

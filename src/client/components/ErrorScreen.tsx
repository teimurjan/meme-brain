import { Button } from './ui/Button';

type Props = {
  error: string | null;
  onRetry: () => void;
};

export function ErrorScreen({ error, onRetry }: Props) {
  return (
    <div className="text-center">
      <span className="font-semibold">Something went wrong</span>
      <p className="text-sm text-gray-600 mb-4">{error}</p>

      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
}

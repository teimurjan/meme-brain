import { useCallback, useEffect, useState } from 'react';
import type {
  Challenge,
  UserState,
  Archetype,
  OptionId,
  ChallengeResponse,
  PlayResponse,
  ErrorResponse,
} from '../../shared/types';

type GameStatus = 'loading' | 'ready' | 'playing' | 'result' | 'error';

type GameState = {
  status: GameStatus;
  challenge: Challenge | null;
  userState: UserState | null;
  hasPlayed: boolean;
  selectedOptionId: OptionId | null;
  result: {
    archetype: Archetype;
    archetypeId: string;
    stats: { total: number; percentage: number };
    shareText: string;
  } | null;
  error: string | null;
};

const initialState: GameState = {
  status: 'loading',
  challenge: null,
  userState: null,
  hasPlayed: false,
  selectedOptionId: null,
  result: null,
  error: null,
};

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);

  const loadChallenge = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    try {
      const res = await fetch('/api/challenge');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as ChallengeResponse | ErrorResponse;
      if (data.type === 'error') throw new Error(data.message);

      const { challenge, userState, hasPlayed, selectedOptionId } = data;

      if (hasPlayed && selectedOptionId) {
        const option = challenge.options.find((o) => o.id === selectedOptionId);
        const archetype = option ? challenge.archetypes[option.archetypeId] : null;

        setState({
          status: 'result',
          challenge,
          userState,
          hasPlayed: true,
          selectedOptionId,
          result: archetype
            ? {
                archetype,
                archetypeId: option!.archetypeId,
                stats: { total: 0, percentage: 0 },
                shareText: formatShareText(archetype.label, archetype.shareText),
              }
            : null,
          error: null,
        });
      } else {
        setState({
          status: 'ready',
          challenge,
          userState,
          hasPlayed: false,
          selectedOptionId: null,
          result: null,
          error: null,
        });
      }
    } catch (err) {
      console.error('Failed to load challenge:', err);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to load challenge',
      }));
    }
  }, []);

  const selectOption = useCallback(
    async (optionId: OptionId) => {
      if (state.status !== 'ready' || !state.challenge) return;

      setState((prev) => ({ ...prev, status: 'playing', selectedOptionId: optionId }));

      try {
        const res = await fetch('/api/play', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ optionId }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as PlayResponse | ErrorResponse;
        if (data.type === 'error') throw new Error(data.message);

        setState((prev) => ({
          ...prev,
          status: 'result',
          hasPlayed: true,
          userState: data.userState,
          result: {
            archetype: data.archetype,
            archetypeId: data.archetypeId,
            stats: data.stats,
            shareText: data.shareText,
          },
        }));
      } catch (err) {
        console.error('Failed to submit choice:', err);
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed to submit choice',
        }));
      }
    },
    [state.status, state.challenge]
  );

  const retry = useCallback(() => {
    void loadChallenge();
  }, [loadChallenge]);

  const reset = useCallback(
    async (clearChallenge = false) => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));

      try {
        const res = await fetch('/api/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clearChallenge }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await loadChallenge();
      } catch (err) {
        console.error('Failed to reset:', err);
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed to reset',
        }));
      }
    },
    [loadChallenge]
  );

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  return {
    ...state,
    selectOption,
    retry,
    reset,
  } as const;
}

function formatShareText(label: string, blurb: string): string {
  return `I'm **${label}** — *"${blurb}"*`;
}

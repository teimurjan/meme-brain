import { useCallback, useEffect, useState } from 'react';
import type {
  Challenge,
  UserState,
  OptionResult,
  OptionId,
  HumorProfile,
  ChallengeResponse,
  PlayResponse,
  ErrorResponse,
  ClubState,
  ClubMember,
} from '../../shared/types';
import { calculateStrike, calculateAccumulatedProfile } from '../../shared/utils/humor-profile';
import { formatShareText } from '../../shared/utils/share-text';

type GameStatus = 'loading' | 'ready' | 'playing' | 'result' | 'error';

type GameState = {
  status: GameStatus;
  challenge: Challenge | null;
  userState: UserState | null;
  hasPlayed: boolean;
  selectedOptionId: OptionId | null;
  result: {
    optionResult: OptionResult;
    optionId: OptionId;
    strike: number;
    humorProfile: HumorProfile;
    shareText: string;
    globalPlayNumber?: number;
    newClubMember?: ClubMember | null;
  } | null;
  error: string | null;
  clubState: ClubState | null;
  showClub: boolean;
};

const initialState: GameState = {
  status: 'loading',
  challenge: null,
  userState: null,
  hasPlayed: false,
  selectedOptionId: null,
  result: null,
  error: null,
  clubState: null,
  showClub: false,
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

      const { challenge, userState, hasPlayed, selectedOptionId, clubState } = data;

      if (hasPlayed && selectedOptionId) {
        const option = challenge.options.find((o) => o.id === selectedOptionId);
        const strike = calculateStrike(userState.history);
        const humorProfile = calculateAccumulatedProfile(userState.history);

        setState({
          status: 'result',
          challenge,
          userState,
          hasPlayed: true,
          selectedOptionId,
          result: option
            ? {
                optionResult: option.result,
                optionId: selectedOptionId,
                strike,
                humorProfile,
                shareText: formatShareText(
                  option.result.label,
                  option.result.roast,
                  humorProfile,
                  strike
                ),
              }
            : null,
          error: null,
          clubState,
          showClub: false,
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
          clubState,
          showClub: false,
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
            optionResult: data.optionResult,
            optionId: data.optionId,
            strike: data.strike,
            humorProfile: data.humorProfile,
            shareText: data.shareText,
            globalPlayNumber: data.globalPlayNumber,
            newClubMember: data.newClubMember,
          },
          clubState: data.clubState,
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

  const resetClub = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearClub: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadChallenge();
    } catch (err) {
      console.error('Failed to reset club:', err);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to reset club',
      }));
    }
  }, [loadChallenge]);

  const setShowClub = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showClub: show }));
  }, []);

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  return {
    ...state,
    selectOption,
    retry,
    reset,
    resetClub,
    setShowClub,
  } as const;
}

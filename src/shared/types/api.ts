import type { Challenge, Archetype, OptionId } from './challenge';
import type { UserState } from './user';

export type ChallengeResponse = {
  type: 'challenge';
  challenge: Challenge;
  userState: UserState;
  hasPlayed: boolean;
  selectedOptionId?: OptionId;
};

export type PlayRequest = {
  optionId: OptionId;
};

export type PlayResponse = {
  type: 'play';
  archetype: Archetype;
  archetypeId: string;
  stats: {
    total: number;
    percentage: number;
  };
  userState: UserState;
  shareText: string;
};

export type ErrorResponse = {
  type: 'error';
  message: string;
};

export type ApiResponse<T> = T | ErrorResponse;

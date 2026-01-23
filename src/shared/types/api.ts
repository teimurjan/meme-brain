import type { Challenge, OptionId, OptionResult, HumorProfile } from './challenge';
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
  optionResult: OptionResult;
  optionId: OptionId;
  strike: number;
  humorProfile: HumorProfile;
  userState: UserState;
  shareText: string;
};

export type ErrorResponse = {
  type: 'error';
  message: string;
};

export type ApiResponse<T> = T | ErrorResponse;

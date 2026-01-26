import type { Challenge, OptionId, OptionResult, HumorProfile } from './challenge';
import type { UserState } from './user';
import type { ClubMember, ClubState } from './club';

export type ChallengeResponse = {
  type: 'challenge';
  challenge: Challenge;
  userState: UserState;
  hasPlayed: boolean;
  selectedOptionId?: OptionId;
  clubState: ClubState;
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
  todayPlayNumber: number;
  newClubMember: ClubMember | null;
  clubState: ClubState;
};

export type ErrorResponse = {
  type: 'error';
  message: string;
};

export type ApiResponse<T> = T | ErrorResponse;

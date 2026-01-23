import type { HumorProfile, OptionId } from './challenge';

export type HistoryEntry = {
  postId: string;
  optionId: OptionId;
  humorProfile: HumorProfile;
  playedAt: string;
};

export type UserState = {
  lastPlayedPost?: string;
  totalPlays: number;
  history: HistoryEntry[];
};

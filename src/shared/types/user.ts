export type HistoryEntry = {
  postId: string;
  archetypeId: string;
  playedAt: string;
};

export type UserState = {
  lastPlayedPost?: string;
  totalPlays: number;
  history: HistoryEntry[];
};

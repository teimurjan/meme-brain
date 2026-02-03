import type { HumorProfile } from './challenge';

export const LUCKY_NUMBERS = [1, 42, 69] as const;
export type LuckyNumber = (typeof LUCKY_NUMBERS)[number];

export type ClubMember = {
  luckyNumber: LuckyNumber;
  username: string;
  snoovatarUrl: string | null;
  subredditName: string;
  claimedAt: string;
  displayName?: string | undefined;
  about?: string | undefined;
  accountCreatedAt?: string | undefined;
  linkKarma?: number | undefined;
  commentKarma?: number | undefined;
  humorProfile?: HumorProfile | undefined;
};

export type ClubState = {
  todayPlayCount: number;
  members: Partial<Record<LuckyNumber, ClubMember>>;
};

export const LUCKY_NUMBER_LORE: Record<LuckyNumber, { title: string; description: string }> = {
  1: {
    title: 'The Pioneer',
    description: 'First to play. The OG. The trailblazer who started it all.',
  },
  42: {
    title: 'The Answer',
    description: 'The Answer to the Ultimate Question of Life, the Universe, and Everything.',
  },
  69: { title: 'Nice', description: 'You know exactly why.' },
};

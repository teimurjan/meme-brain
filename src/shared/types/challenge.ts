export type OptionId = 'A' | 'B' | 'C';

export const HUMOR_TYPES = ['absurdist', 'sarcastic', 'wholesome', 'unhinged', 'deadpan'] as const;
export type HumorType = (typeof HUMOR_TYPES)[number];
export type HumorProfile = Record<HumorType, number>;

export type OptionResult = {
  label: string;
  roast: string;
};

export type ChallengeOption = {
  id: OptionId;
  text: string;
  humorProfile: HumorProfile;
  result: OptionResult;
};

export type MemeSource = {
  postId: string;
  subreddit: string;
  title: string;
  imageUrl: string;
  permalink: string;
  author?: string;
};

export type ModerationInfo = {
  safe: boolean;
  flags: string[];
  source: 'llm' | 'fallback' | 'template';
};

export type ModelInfo = {
  provider: string;
  name: string;
  version?: string;
};

export type Challenge = {
  postId: string;
  seed: string;
  generatedAt: string;
  model: ModelInfo;
  meme: MemeSource;
  options: [ChallengeOption, ChallengeOption, ChallengeOption];
  moderation: ModerationInfo;
};

export type LLMGeneratedContent = {
  options: [ChallengeOption, ChallengeOption, ChallengeOption];
  moderationFlags: string[];
};

export function createEmptyHumorProfile(): HumorProfile {
  return {
    absurdist: 0,
    sarcastic: 0,
    wholesome: 0,
    unhinged: 0,
    deadpan: 0,
  };
}

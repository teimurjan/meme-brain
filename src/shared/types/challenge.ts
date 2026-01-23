export type GameType = 'wrongMeaning' | 'wrongTone' | 'wrongFraming';
export type OptionId = 'A' | 'B' | 'C';

export const GAME_TYPE_CONFIG = {
  wrongMeaning: {
    label: 'Wrong Meaning',
    prompt: 'Pick the most confidently incorrect interpretation.',
  },
  wrongTone: {
    label: 'Wrong Tone',
    prompt: 'Pick the response with the most wrong vibe.',
  },
  wrongFraming: {
    label: 'Wrong Framing',
    prompt: 'Pick the most Reddit-brained explanation.',
  },
} as const;

export type MemeSource = {
  postId: string;
  subreddit: string;
  title: string;
  imageUrl: string;
  permalink: string;
  author?: string;
};

export type ChallengeOption = {
  id: OptionId;
  text: string;
  archetypeId: string;
};

export type Archetype = {
  label: string;
  blurb: string;
  shareText: string;
  tags?: string[];
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
  gameType: GameType;
  meme: MemeSource;
  situation: string;
  options: [ChallengeOption, ChallengeOption, ChallengeOption];
  archetypes: Record<string, Archetype>;
  moderation: ModerationInfo;
};

export type LLMGeneratedContent = {
  situation: string;
  options: [ChallengeOption, ChallengeOption, ChallengeOption];
  archetypes: Record<string, Archetype>;
  moderationFlags: string[];
};

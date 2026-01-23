export const config = {
  dayBoundaryTimezone: 'UTC',

  meme: {
    subredditAllowlist: [
      'memes',
      'dankmemes',
      'me_irl',
      'meirl',
      'wholesomememes',
      'AdviceAnimals',
      'MemeEconomy',
      'comedyheaven',
      'okbuddyretard',
      'surrealmemes',
    ],
    minScore: 1000,
    maxTitleLength: 200,
    maxCommentLength: 100,
    preferredDomains: ['i.redd.it', 'i.imgur.com'],
  },

  llm: {
    provider: 'openai',
    model: 'gpt-5.2',
    maxRetries: 3,
    timeoutMs: 30000,
  },

  content: {
    maxSituationLength: 140,
    maxOptionLength: 90,
    maxArchetypeLabelLength: 26,
    historyLimit: 7,
  },

  safety: {
    hardDenylist: ['kill yourself', 'kys', 'suicide', 'slur', 'n-word', 'f-word', 'retard'],
    softDenylist: [
      'politics',
      'election',
      'trump',
      'biden',
      'democrat',
      'republican',
      'abortion',
      'gun control',
    ],
    nsfw: false,
    spoilers: false,
  },

  redis: {
    keys: {
      challenge: (dateKey: string) => `challenge:${dateKey}`,
      challengeLock: (dateKey: string) => `challenge:${dateKey}:lock`,
      userState: (userId: string) => `user:${userId}:state`,
      userHistory: (userId: string) => `user:${userId}:history`,
      stats: (dateKey: string) => `stats:${dateKey}`,
    },
    lockTtlSeconds: 60,
    challengeTtlSeconds: 60 * 60 * 48, // 48 hours
  },
} as const;

export type Config = typeof config;

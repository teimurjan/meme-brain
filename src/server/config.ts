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
    maxOptionLength: 90,
    maxLabelLength: 26,
    maxRoastLength: 140,
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
      challenge: (postId: string) => `challenge:${postId}`,
      challengeLock: (postId: string) => `challenge:${postId}:lock`,
      userState: (userId: string) => `user:${userId}:state`,
      dailyPlayCount: (dateKey: string) => `plays:${dateKey}`,
      dailyClub: (dateKey: string) => `club:${dateKey}`,
    },
    lockTtlSeconds: 60,
    challengeTtlSeconds: 60 * 60 * 48, // 48 hours
    dailyTtlSeconds: 60 * 60 * 24 * 7, // 7 days
  },
} as const;

export type Config = typeof config;

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
      challenge: (dateKey: string) => `challenge:${dateKey}`,
      challengeLock: (dateKey: string) => `challenge:${dateKey}:lock`,
      userState: (userId: string) => `user:${userId}:state`,
      userHistory: (userId: string) => `user:${userId}:history`,
      stats: (dateKey: string) => `stats:${dateKey}`,
      globalPlayCount: () => 'global:playCount',
      clubMembers: () => 'club:members',
    },
    lockTtlSeconds: 60,
    challengeTtlSeconds: 60 * 60 * 48, // 48 hours
  },
} as const;

export type Config = typeof config;

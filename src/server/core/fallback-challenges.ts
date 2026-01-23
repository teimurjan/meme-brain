import type { Challenge, ChallengeOption, HumorProfile } from '../../shared/types';

type FallbackTemplate = {
  meme: {
    imageUrl: string;
    title: string;
    subreddit: string;
  };
  options: [ChallengeOption, ChallengeOption, ChallengeOption];
};

function hp(
  absurdist: number,
  sarcastic: number,
  wholesome: number,
  unhinged: number,
  deadpan: number
): HumorProfile {
  return { absurdist, sarcastic, wholesome, unhinged, deadpan };
}

export const fallbackChallenges: FallbackTemplate[] = [
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder1.jpg',
      title: 'When you finally fix the bug after 6 hours',
      subreddit: 'ProgrammerHumor',
    },
    options: [
      {
        id: 'A',
        text: 'This is literally just a picture of code working',
        humorProfile: hp(0, 0, 0, 0, 0.9),
        result: {
          label: 'Literal Larry',
          roast:
            'You take everything at face value. Sarcasm bounces off you like bugs off a windshield.',
        },
      },
      {
        id: 'B',
        text: 'Per my previous commit, the implementation is now functional',
        humorProfile: hp(0, 0.7, 0, 0, 0.5),
        result: {
          label: 'Corporate Coder',
          roast: 'You speak in Jira tickets and synergy. Your soul was outsourced years ago.',
        },
      },
      {
        id: 'C',
        text: 'This is r/antiwork energy tbh',
        humorProfile: hp(0, 0.8, 0, 0.4, 0),
        result: {
          label: 'Subreddit Psychic',
          roast: 'Every post belongs somewhere else. You see the Reddit multiverse.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder2.jpg',
      title: 'Nobody: ... Me at 2am:',
      subreddit: 'me_irl',
    },
    options: [
      {
        id: 'A',
        text: 'This is just a person being awake at night?',
        humorProfile: hp(0, 0, 0.3, 0, 0.8),
        result: {
          label: 'Confused Observer',
          roast: "You genuinely don't understand why this is funny. That makes you funnier.",
        },
      },
      {
        id: 'B',
        text: 'Studies suggest nocturnal behavior correlates with creativity',
        humorProfile: hp(0, 0.6, 0, 0, 0.7),
        result: {
          label: 'Academic Andy',
          roast: 'You cite sources for memes. Your thesis was peer-reviewed by nobody.',
        },
      },
      {
        id: 'C',
        text: 'This has massive r/im14andthisisdeep vibes',
        humorProfile: hp(0, 0.9, 0, 0.3, 0),
        result: {
          label: 'Depth Detector',
          roast: 'You can smell pseudo-profundity from three subreddits away.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder3.jpg',
      title: 'POV: You said you liked something on the internet',
      subreddit: 'dankmemes',
    },
    options: [
      {
        id: 'A',
        text: 'This is just people having different opinions though',
        humorProfile: hp(0, 0, 0.6, 0, 0.5),
        result: {
          label: 'Peaceful Diplomat',
          roast: 'You think people can just... get along? On the internet? Oh, honey.',
        },
      },
      {
        id: 'B',
        text: 'I would like to schedule a mediation session',
        humorProfile: hp(0, 0.5, 0.4, 0, 0.4),
        result: {
          label: 'HR Helen',
          roast: 'You respond to flame wars with calendar invites. Your notifications are muted.',
        },
      },
      {
        id: 'C',
        text: 'Average r/SubredditDrama bait',
        humorProfile: hp(0, 0.8, 0, 0.6, 0),
        result: {
          label: 'Drama Diviner',
          roast: 'You can predict a locked thread before it happens. Your popcorn is always ready.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder4.jpg',
      title: 'Just found out about [thing]. Damn that sucks.',
      subreddit: 'memes',
    },
    options: [
      {
        id: 'A',
        text: 'Wait what thing? I need context',
        humorProfile: hp(0, 0, 0.4, 0, 0.7),
        result: {
          label: 'Context Craver',
          roast:
            'You need the full lore before you laugh. Your meme comprehension requires footnotes.',
        },
      },
      {
        id: 'B',
        text: 'This appears to reference current events of significance',
        humorProfile: hp(0, 0.5, 0, 0, 0.8),
        result: {
          label: 'News Narrator',
          roast: 'You explain jokes like a press release. Your humor has been fact-checked.',
        },
      },
      {
        id: 'C',
        text: 'This is that r/OutOfTheLoop post waiting to happen',
        humorProfile: hp(0, 0.7, 0, 0.5, 0),
        result: {
          label: 'Loop Locator',
          roast: 'You know exactly which sub will explain this in 3 hours. You are the algorithm.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder5.jpg',
      title: 'Me explaining to my parents why I need a $3000 gaming setup',
      subreddit: 'pcmasterrace',
    },
    options: [
      {
        id: 'A',
        text: 'But do you actually need all that for games?',
        humorProfile: hp(0, 0, 0.3, 0, 0.8),
        result: {
          label: 'Specs Skeptic',
          roast: 'You question every build. Your PC runs on doubt and integrated graphics.',
        },
      },
      {
        id: 'B',
        text: 'A cost-benefit analysis would be appropriate here',
        humorProfile: hp(0, 0.6, 0, 0, 0.6),
        result: {
          label: 'Finance Frank',
          roast: 'You see RGB and think ROI. Your spreadsheets have spreadsheets.',
        },
      },
      {
        id: 'C',
        text: 'This is r/personalfinance having a breakdown',
        humorProfile: hp(0, 0.7, 0, 0.5, 0),
        result: {
          label: 'Budget Bouncer',
          roast: 'You guard wallets like a dragon hoards gold. Every purchase needs a tribunal.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder6.jpg',
      title: "Therapist: Internet culture can't hurt you",
      subreddit: 'comedyheaven',
    },
    options: [
      {
        id: 'A',
        text: 'This is just an image with text on it',
        humorProfile: hp(0, 0, 0, 0, 0.95),
        result: {
          label: 'Format Fundamentalist',
          roast: 'You reduce all memes to their atomic structure. Humor is just patterns.',
        },
      },
      {
        id: 'B',
        text: 'I recommend discussing this in our next session',
        humorProfile: hp(0, 0.4, 0.5, 0, 0.4),
        result: {
          label: 'Therapy Talker',
          roast: 'You respond to chaos with coping mechanisms. Your energy is concerningly calm.',
        },
      },
      {
        id: 'C',
        text: 'Pure r/surrealmemes ascension',
        humorProfile: hp(0.9, 0, 0, 0.6, 0),
        result: {
          label: 'Void Voyager',
          roast: 'You have transcended understanding. Meaning is optional. You are the meme.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder7.jpg',
      title: 'Average fan vs average enjoyer',
      subreddit: 'memes',
    },
    options: [
      {
        id: 'A',
        text: 'Both seem like reasonable positions though',
        humorProfile: hp(0, 0, 0.7, 0, 0.4),
        result: {
          label: 'Both Sides Bob',
          roast: 'You see merit in everything. Your take is lukewarm and universally acceptable.',
        },
      },
      {
        id: 'B',
        text: 'This dichotomy oversimplifies nuanced preferences',
        humorProfile: hp(0, 0.6, 0, 0, 0.7),
        result: {
          label: 'Nuance Ninja',
          roast: 'You find complexity where there is none. Your essays have essays.',
        },
      },
      {
        id: 'C',
        text: 'Certified r/gatekeeping moment',
        humorProfile: hp(0, 0.8, 0, 0.4, 0),
        result: {
          label: 'Gate Guardian',
          roast: 'You sense exclusion from miles away. Your radar is calibrated for cringe.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder8.jpg',
      title: 'My last brain cell during finals',
      subreddit: 'college',
    },
    options: [
      {
        id: 'A',
        text: 'You should probably study instead of posting',
        humorProfile: hp(0, 0.5, 0.3, 0, 0.5),
        result: {
          label: 'Productivity Police',
          roast: 'You remind people of responsibilities at the worst times. You are exhausting.',
        },
      },
      {
        id: 'B',
        text: 'Consider implementing a structured revision schedule',
        humorProfile: hp(0, 0.4, 0, 0, 0.8),
        result: {
          label: 'Schedule Sage',
          roast: 'You have a system for everything. Your calendar has a calendar.',
        },
      },
      {
        id: 'C',
        text: 'This belongs on r/GetMotivated ironically',
        humorProfile: hp(0, 0.9, 0, 0.4, 0),
        result: {
          label: 'Motivation Mocker',
          roast: 'You see inspirational content and choose violence. Hustle culture fears you.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder9.jpg',
      title: 'The four horsemen of [generic thing]',
      subreddit: 'starterpacks',
    },
    options: [
      {
        id: 'A',
        text: 'There are only four images here, not horsemen',
        humorProfile: hp(0, 0, 0, 0, 0.95),
        result: {
          label: 'Pedant Pete',
          roast: 'You correct metaphors like typos. Your friends have stopped inviting you places.',
        },
      },
      {
        id: 'B',
        text: 'This categorical framework lacks methodological rigor',
        humorProfile: hp(0, 0.5, 0, 0, 0.7),
        result: {
          label: 'Methodology Maven',
          roast: 'You peer-review memes. Your humor requires citations.',
        },
      },
      {
        id: 'C',
        text: 'r/starterpacks is leaking again',
        humorProfile: hp(0, 0.8, 0, 0.4, 0),
        result: {
          label: 'Leak Locator',
          roast: 'You trace meme origins like a detective. Nothing escapes your sub-awareness.',
        },
      },
    ],
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder10.jpg',
      title: "Society if [thing] didn't exist",
      subreddit: 'dankmemes',
    },
    options: [
      {
        id: 'A',
        text: 'This utopia seems architecturally impractical',
        humorProfile: hp(0, 0.4, 0, 0, 0.8),
        result: {
          label: 'Architect Alex',
          roast: 'You evaluate fictional cities by zoning laws. Your dreams have building codes.',
        },
      },
      {
        id: 'B',
        text: 'Counterfactual scenarios require careful consideration',
        humorProfile: hp(0, 0.3, 0, 0, 0.8),
        result: {
          label: 'Philosopher Phil',
          roast: 'You take hypotheticals seriously. Your what-ifs have what-ifs.',
        },
      },
      {
        id: 'C',
        text: 'Peak r/im14andthisisdeep material',
        humorProfile: hp(0, 0.9, 0, 0.3, 0),
        result: {
          label: 'Depth Detector',
          roast: 'You can smell pseudo-profundity from three subreddits away.',
        },
      },
    ],
  },
];

export function getFallbackChallenge(postId: string): Challenge {
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = (hash << 5) - hash + postId.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % fallbackChallenges.length;
  const template = fallbackChallenges[index]!;

  return {
    postId,
    seed: `fallback-${index}`,
    generatedAt: new Date().toISOString(),
    model: { provider: 'fallback', name: 'curated', version: '1.0' },
    meme: {
      postId: `fallback-meme-${index}`,
      subreddit: template.meme.subreddit,
      title: template.meme.title,
      imageUrl: template.meme.imageUrl,
      permalink: `/r/${template.meme.subreddit}/comments/fallback`,
    },
    options: template.options,
    moderation: { safe: true, flags: [], source: 'fallback' },
  };
}

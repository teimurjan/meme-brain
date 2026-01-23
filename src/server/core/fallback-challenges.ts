import type { Challenge, ChallengeOption, Archetype, GameType } from '../../shared/types';

type FallbackTemplate = {
  meme: {
    imageUrl: string;
    title: string;
    subreddit: string;
  };
  situation: string;
  options: [ChallengeOption, ChallengeOption, ChallengeOption];
  archetypes: Record<string, Archetype>;
};

export const fallbackChallenges: FallbackTemplate[] = [
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder1.jpg',
      title: 'When you finally fix the bug after 6 hours',
      subreddit: 'ProgrammerHumor',
    },
    situation: 'This gets posted at 3AM and somehow hits the front page.',
    options: [
      {
        id: 'A',
        text: 'This is literally just a picture of code working',
        archetypeId: 'literal_larry',
      },
      {
        id: 'B',
        text: 'Per my previous commit, the implementation is now functional',
        archetypeId: 'corporate_coder',
      },
      {
        id: 'C',
        text: 'This is r/antiwork energy tbh',
        archetypeId: 'subreddit_psychic',
      },
    ],
    archetypes: {
      literal_larry: {
        label: 'Literal Larry',
        blurb:
          'You take everything at face value. Sarcasm bounces off you like bugs off a windshield.',
        shareText: 'I see only facts. Jokes are inefficient.',
      },
      corporate_coder: {
        label: 'Corporate Coder',
        blurb: 'You speak in Jira tickets and synergy. Your soul was outsourced years ago.',
        shareText: 'Per my last standup, I am dead inside.',
      },
      subreddit_psychic: {
        label: 'Subreddit Psychic',
        blurb: 'Every post belongs somewhere else. You see the Reddit multiverse.',
        shareText: 'Wrong sub energy detected. Crossposting initiated.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder2.jpg',
      title: 'Nobody: ... Me at 2am:',
      subreddit: 'me_irl',
    },
    situation: 'Someone posts this unironically and defends it in the comments.',
    options: [
      {
        id: 'A',
        text: 'This is just a person being awake at night?',
        archetypeId: 'confused_observer',
      },
      {
        id: 'B',
        text: 'Studies suggest nocturnal behavior correlates with creativity',
        archetypeId: 'academic_andy',
      },
      {
        id: 'C',
        text: 'This has massive r/im14andthisisdeep vibes',
        archetypeId: 'depth_detector',
      },
    ],
    archetypes: {
      confused_observer: {
        label: 'Confused Observer',
        blurb: "You genuinely don't understand why this is funny. That makes you funnier.",
        shareText: "I don't get it but I'm here anyway.",
      },
      academic_andy: {
        label: 'Academic Andy',
        blurb: 'You cite sources for memes. Your thesis was peer-reviewed by nobody.',
        shareText: 'Actually, according to studies...',
      },
      depth_detector: {
        label: 'Depth Detector',
        blurb: 'You can smell pseudo-profundity from three subreddits away.',
        shareText: 'This is deep... like a puddle.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder3.jpg',
      title: 'POV: You said you liked something on the internet',
      subreddit: 'dankmemes',
    },
    situation: 'You see this and instantly know the comment section will melt.',
    options: [
      {
        id: 'A',
        text: 'This is just people having different opinions though',
        archetypeId: 'peaceful_diplomat',
      },
      {
        id: 'B',
        text: 'I would like to schedule a mediation session',
        archetypeId: 'hr_helen',
      },
      {
        id: 'C',
        text: 'Average r/SubredditDrama bait',
        archetypeId: 'drama_diviner',
      },
    ],
    archetypes: {
      peaceful_diplomat: {
        label: 'Peaceful Diplomat',
        blurb: 'You think people can just... get along? On the internet? Oh, honey.',
        shareText: "Can't we all just be nice?",
      },
      hr_helen: {
        label: 'HR Helen',
        blurb: 'You respond to flame wars with calendar invites. Your notifications are muted.',
        shareText: "Let's take this to a private channel.",
      },
      drama_diviner: {
        label: 'Drama Diviner',
        blurb: 'You can predict a locked thread before it happens. Your popcorn is always ready.',
        shareText: "I'm just here for the comments.",
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder4.jpg',
      title: 'Just found out about [thing]. Damn that sucks.',
      subreddit: 'memes',
    },
    situation: 'This hits the front page and everyone pretends to understand it.',
    options: [
      {
        id: 'A',
        text: 'Wait what thing? I need context',
        archetypeId: 'context_craver',
      },
      {
        id: 'B',
        text: 'This appears to reference current events of significance',
        archetypeId: 'news_narrator',
      },
      {
        id: 'C',
        text: 'This is that r/OutOfTheLoop post waiting to happen',
        archetypeId: 'loop_locator',
      },
    ],
    archetypes: {
      context_craver: {
        label: 'Context Craver',
        blurb:
          'You need the full lore before you laugh. Your meme comprehension requires footnotes.',
        shareText: 'Can someone explain this meme?',
      },
      news_narrator: {
        label: 'News Narrator',
        blurb: 'You explain jokes like a press release. Your humor has been fact-checked.',
        shareText: 'Sources report this is amusing.',
      },
      loop_locator: {
        label: 'Loop Locator',
        blurb: 'You know exactly which sub will explain this in 3 hours. You are the algorithm.',
        shareText: 'See you on OutOfTheLoop tomorrow.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder5.jpg',
      title: 'Me explaining to my parents why I need a $3000 gaming setup',
      subreddit: 'pcmasterrace',
    },
    situation: 'The comment section becomes a tech support thread.',
    options: [
      {
        id: 'A',
        text: 'But do you actually need all that for games?',
        archetypeId: 'specs_skeptic',
      },
      {
        id: 'B',
        text: 'A cost-benefit analysis would be appropriate here',
        archetypeId: 'finance_frank',
      },
      {
        id: 'C',
        text: 'This is r/personalfinance having a breakdown',
        archetypeId: 'budget_bouncer',
      },
    ],
    archetypes: {
      specs_skeptic: {
        label: 'Specs Skeptic',
        blurb: 'You question every build. Your PC runs on doubt and integrated graphics.',
        shareText: 'But can it run Crysis?',
      },
      finance_frank: {
        label: 'Finance Frank',
        blurb: 'You see RGB and think ROI. Your spreadsheets have spreadsheets.',
        shareText: 'Have you considered index funds?',
      },
      budget_bouncer: {
        label: 'Budget Bouncer',
        blurb: 'You guard wallets like a dragon hoards gold. Every purchase needs a tribunal.',
        shareText: "That's rent money. Stop.",
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder6.jpg',
      title: "Therapist: Internet culture can't hurt you",
      subreddit: 'comedyheaven',
    },
    situation: 'Someone screenshotted this from their camera roll at 4am.',
    options: [
      {
        id: 'A',
        text: 'This is just an image with text on it',
        archetypeId: 'format_fundamentalist',
      },
      {
        id: 'B',
        text: 'I recommend discussing this in our next session',
        archetypeId: 'therapy_talker',
      },
      {
        id: 'C',
        text: 'Pure r/surrealmemes ascension',
        archetypeId: 'void_voyager',
      },
    ],
    archetypes: {
      format_fundamentalist: {
        label: 'Format Fundamentalist',
        blurb: 'You reduce all memes to their atomic structure. Humor is just patterns.',
        shareText: "It's just text on an image.",
      },
      therapy_talker: {
        label: 'Therapy Talker',
        blurb: 'You respond to chaos with coping mechanisms. Your energy is concerningly calm.',
        shareText: 'And how does that make you feel?',
      },
      void_voyager: {
        label: 'Void Voyager',
        blurb: 'You have transcended understanding. Meaning is optional. You are the meme.',
        shareText: 'I am one with the absurd.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder7.jpg',
      title: 'Average fan vs average enjoyer',
      subreddit: 'memes',
    },
    situation: 'This template refuses to die and keeps coming back stronger.',
    options: [
      {
        id: 'A',
        text: 'Both seem like reasonable positions though',
        archetypeId: 'both_sides_bob',
      },
      {
        id: 'B',
        text: 'This dichotomy oversimplifies nuanced preferences',
        archetypeId: 'nuance_ninja',
      },
      {
        id: 'C',
        text: 'Certified r/gatekeeping moment',
        archetypeId: 'gate_guardian',
      },
    ],
    archetypes: {
      both_sides_bob: {
        label: 'Both Sides Bob',
        blurb: 'You see merit in everything. Your take is lukewarm and universally acceptable.',
        shareText: 'Both options are valid actually.',
      },
      nuance_ninja: {
        label: 'Nuance Ninja',
        blurb: 'You find complexity where there is none. Your essays have essays.',
        shareText: "It's more complicated than that.",
      },
      gate_guardian: {
        label: 'Gate Guardian',
        blurb: 'You sense exclusion from miles away. Your radar is calibrated for cringe.',
        shareText: 'Let people enjoy things.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder8.jpg',
      title: 'My last brain cell during finals',
      subreddit: 'college',
    },
    situation: 'Every college student sends this to their group chat simultaneously.',
    options: [
      {
        id: 'A',
        text: 'You should probably study instead of posting',
        archetypeId: 'productivity_police',
      },
      {
        id: 'B',
        text: 'Consider implementing a structured revision schedule',
        archetypeId: 'schedule_sage',
      },
      {
        id: 'C',
        text: 'This belongs on r/GetMotivated ironically',
        archetypeId: 'motivation_mocker',
      },
    ],
    archetypes: {
      productivity_police: {
        label: 'Productivity Police',
        blurb: 'You remind people of responsibilities at the worst times. You are exhausting.',
        shareText: 'But did you finish your tasks?',
      },
      schedule_sage: {
        label: 'Schedule Sage',
        blurb: 'You have a system for everything. Your calendar has a calendar.',
        shareText: 'Have you tried time-blocking?',
      },
      motivation_mocker: {
        label: 'Motivation Mocker',
        blurb: 'You see inspirational content and choose violence. Hustle culture fears you.',
        shareText: 'Rise and grind? More like crash and burn.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder9.jpg',
      title: 'The four horsemen of [generic thing]',
      subreddit: 'starterpacks',
    },
    situation: 'Someone made this at work and thought they were the first.',
    options: [
      {
        id: 'A',
        text: 'There are only four images here, not horsemen',
        archetypeId: 'pedant_pete',
      },
      {
        id: 'B',
        text: 'This categorical framework lacks methodological rigor',
        archetypeId: 'methodology_maven',
      },
      {
        id: 'C',
        text: 'r/starterpacks is leaking again',
        archetypeId: 'leak_locator',
      },
    ],
    archetypes: {
      pedant_pete: {
        label: 'Pedant Pete',
        blurb: 'You correct metaphors like typos. Your friends have stopped inviting you places.',
        shareText: 'Actually, technically...',
      },
      methodology_maven: {
        label: 'Methodology Maven',
        blurb: 'You peer-review memes. Your humor requires citations.',
        shareText: 'Source?',
      },
      leak_locator: {
        label: 'Leak Locator',
        blurb: 'You trace meme origins like a detective. Nothing escapes your sub-awareness.',
        shareText: 'This format escaped containment.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder10.jpg',
      title: "Society if [thing] didn't exist",
      subreddit: 'dankmemes',
    },
    situation: 'This gets reposted with a different caption every 3 hours.',
    options: [
      {
        id: 'A',
        text: 'This utopia seems architecturally impractical',
        archetypeId: 'architect_alex',
      },
      {
        id: 'B',
        text: 'Counterfactual scenarios require careful consideration',
        archetypeId: 'philosopher_phil',
      },
      {
        id: 'C',
        text: 'Peak r/im14andthisisdeep material',
        archetypeId: 'depth_detector',
      },
    ],
    archetypes: {
      architect_alex: {
        label: 'Architect Alex',
        blurb: 'You evaluate fictional cities by zoning laws. Your dreams have building codes.',
        shareText: "Where's the parking though?",
      },
      philosopher_phil: {
        label: 'Philosopher Phil',
        blurb: 'You take hypotheticals seriously. Your what-ifs have what-ifs.',
        shareText: 'But would this world be better?',
      },
      depth_detector: {
        label: 'Depth Detector',
        blurb: 'You can smell pseudo-profundity from three subreddits away.',
        shareText: 'This is deep... like a puddle.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder11.jpg',
      title: "Tell me you're [thing] without telling me you're [thing]",
      subreddit: 'memes',
    },
    situation: 'The comments become a competition nobody asked for.',
    options: [
      {
        id: 'A',
        text: "But they did tell you? It's in the caption",
        archetypeId: 'literal_larry',
      },
      {
        id: 'B',
        text: 'This indirect communication style is fascinating',
        archetypeId: 'linguist_linda',
      },
      {
        id: 'C',
        text: 'TikTok format leaking into Reddit again',
        archetypeId: 'platform_purist',
      },
    ],
    archetypes: {
      literal_larry: {
        label: 'Literal Larry',
        blurb:
          'You take everything at face value. Sarcasm bounces off you like bugs off a windshield.',
        shareText: 'I see only facts. Jokes are inefficient.',
      },
      linguist_linda: {
        label: 'Linguist Linda',
        blurb: 'You analyze meme syntax like ancient texts. Your upvotes are peer reviews.',
        shareText: 'The semiotics here are fascinating.',
      },
      platform_purist: {
        label: 'Platform Purist',
        blurb: 'You guard Reddit from outside influence. Your fedora is tipped permanently.',
        shareText: "We don't do that here.",
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder12.jpg',
      title: 'Introverts when someone talks to them',
      subreddit: 'introvert',
    },
    situation: 'Everyone in the comments claims to be MORE introverted.',
    options: [
      {
        id: 'A',
        text: 'Communication is a normal human function though',
        archetypeId: 'social_scientist',
      },
      {
        id: 'B',
        text: 'Perhaps we could schedule a brief interaction window',
        archetypeId: 'calendar_karen',
      },
      {
        id: 'C',
        text: 'r/notlikeothergirls but for personality types',
        archetypeId: 'unique_spotter',
      },
    ],
    archetypes: {
      social_scientist: {
        label: 'Social Scientist',
        blurb: 'You explain obvious things scientifically. Your small talk has citations.',
        shareText: 'Humans are social creatures, actually.',
      },
      calendar_karen: {
        label: 'Calendar Karen',
        blurb: 'You schedule spontaneity. Your availability is a privilege, not a right.',
        shareText: 'Let me check my calendar... no.',
      },
      unique_spotter: {
        label: 'Unique Spotter',
        blurb: 'You see "not like others" energy everywhere. Your detection skills are unmatched.',
        shareText: "We get it, you're different.",
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder13.jpg',
      title: 'Drake approving/disapproving template #47382',
      subreddit: 'memes',
    },
    situation: 'This exact meme has been posted 10,000 times but it still works.',
    options: [
      {
        id: 'A',
        text: 'Is this the same person in both images?',
        archetypeId: 'face_checker',
      },
      {
        id: 'B',
        text: 'The preference dichotomy is clearly illustrated here',
        archetypeId: 'diagram_dan',
      },
      {
        id: 'C',
        text: 'r/ComedyCemetery speedrun any%',
        archetypeId: 'comedy_coroner',
      },
    ],
    archetypes: {
      face_checker: {
        label: 'Face Checker',
        blurb: 'You verify identities in memes. Your attention to detail is concerning.',
        shareText: 'Wait, who is this person?',
      },
      diagram_dan: {
        label: 'Diagram Dan',
        blurb: 'You see flowcharts in everything. Your brain runs on bullet points.',
        shareText: 'The visual hierarchy here is clear.',
      },
      comedy_coroner: {
        label: 'Comedy Coroner',
        blurb: 'You declare memes dead on arrival. Your autopsy reports are devastating.',
        shareText: 'Time of death: when this was posted.',
      },
    },
  },
  {
    meme: {
      imageUrl: 'https://i.redd.it/placeholder14.jpg',
      title: 'Boomers vs Millennials vs Gen Z',
      subreddit: 'generationwar',
    },
    situation: 'Every generation claims this meme is attacking them specifically.',
    options: [
      {
        id: 'A',
        text: 'These are just different age groups of people',
        archetypeId: 'demographer_dan',
      },
      {
        id: 'B',
        text: 'Generational analysis requires longitudinal studies',
        archetypeId: 'researcher_ron',
      },
      {
        id: 'C',
        text: 'r/lewronggeneration having a field day',
        archetypeId: 'nostalgia_narc',
      },
    ],
    archetypes: {
      demographer_dan: {
        label: 'Demographer Dan',
        blurb: 'You see birth years, not stereotypes. Your census data is always current.',
        shareText: 'These cohort boundaries are arbitrary.',
      },
      researcher_ron: {
        label: 'Researcher Ron',
        blurb: 'You need data before you laugh. Your humor requires peer review.',
        shareText: 'Correlation does not imply causation.',
      },
      nostalgia_narc: {
        label: 'Nostalgia Narc',
        blurb: 'You bust people for "wrong era" syndrome. Your present is always better.',
        shareText: 'Born in the wrong generation? Cringe.',
      },
    },
  },
];

export function getFallbackChallenge(postId: string, gameType: GameType): Challenge {
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
    gameType,
    meme: {
      postId: `fallback-meme-${index}`,
      subreddit: template.meme.subreddit,
      title: template.meme.title,
      imageUrl: template.meme.imageUrl,
      permalink: `/r/${template.meme.subreddit}/comments/fallback`,
    },
    situation: template.situation,
    options: template.options,
    archetypes: template.archetypes,
    moderation: { safe: true, flags: [], source: 'fallback' },
  };
}

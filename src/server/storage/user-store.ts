import { redis } from '@devvit/web/server';
import type { UserState, HumorProfile, OptionId } from '../../shared/types';
import { config } from '../config';

export { calculateStrike, calculateAccumulatedProfile } from '../../shared/utils/humor-profile';

const HISTORY_DAYS = 7;

export const DEFAULT_USER_STATE: UserState = {
  history: [],
};

export async function getUserState(userId: string): Promise<UserState> {
  const key = config.redis.keys.userState(userId);
  const data = await redis.get(key);
  if (!data) return { ...DEFAULT_USER_STATE };
  return JSON.parse(data) as UserState;
}

export async function setUserState(userId: string, state: UserState): Promise<void> {
  const key = config.redis.keys.userState(userId);
  await redis.set(key, JSON.stringify(state));
}

export async function recordPlay(
  userId: string,
  postId: string,
  optionId: OptionId,
  humorProfile: HumorProfile
): Promise<UserState> {
  const state = await getUserState(userId);

  const newEntry = {
    postId,
    optionId,
    humorProfile,
    playedAt: new Date().toISOString(),
  };

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - HISTORY_DAYS);

  const filteredHistory = state.history.filter((h) => new Date(h.playedAt) > cutoffDate);
  const newHistory = [newEntry, ...filteredHistory];

  const newState: UserState = {
    lastPlayedPost: postId,
    history: newHistory,
  };

  await setUserState(userId, newState);
  return newState;
}

export async function hasPlayedChallenge(
  userId: string,
  postId: string,
  challengeGeneratedAt: string
): Promise<boolean> {
  const state = await getUserState(userId);
  const entry = state.history.find((h) => h.postId === postId);
  if (!entry) return false;

  const playedAt = new Date(entry.playedAt).getTime();
  const generatedAt = new Date(challengeGeneratedAt).getTime();

  return playedAt >= generatedAt;
}

export async function getSelectedOption(userId: string, postId: string): Promise<OptionId | null> {
  const state = await getUserState(userId);
  const entry = state.history.find((h) => h.postId === postId);
  return entry?.optionId ?? null;
}

export async function resetPostPlay(userId: string, postId: string): Promise<UserState> {
  const state = await getUserState(userId);

  const hasPlayed = state.history.some((h) => h.postId === postId);
  if (!hasPlayed) {
    return state;
  }

  const newHistory = state.history.filter((h) => h.postId !== postId);
  const wasLastPlayed = state.lastPlayedPost === postId;
  const newState: UserState = {
    history: newHistory,
  };
  if (!wasLastPlayed && state.lastPlayedPost) {
    newState.lastPlayedPost = state.lastPlayedPost;
  }

  await setUserState(userId, newState);
  return newState;
}

import { redis } from '@devvit/web/server';
import type { UserState, HumorProfile, OptionId } from '../../shared/types';
import { config } from '../config';

export { calculateStrike, calculateAccumulatedProfile } from '../../shared/utils/humor-profile';

export const DEFAULT_USER_STATE: UserState = {
  totalPlays: 0,
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

  if (state.history.some((h) => h.postId === postId)) {
    return state;
  }

  const newEntry = {
    postId,
    optionId,
    humorProfile,
    playedAt: new Date().toISOString(),
  };
  const newHistory = [newEntry, ...state.history].slice(0, config.content.historyLimit);

  const newState: UserState = {
    lastPlayedPost: postId,
    totalPlays: state.totalPlays + 1,
    history: newHistory,
  };

  await setUserState(userId, newState);
  return newState;
}

export async function hasPlayedPost(userId: string, postId: string): Promise<boolean> {
  const state = await getUserState(userId);
  return state.history.some((h) => h.postId === postId);
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
    totalPlays: Math.max(0, state.totalPlays - 1),
    history: newHistory,
  };
  if (!wasLastPlayed && state.lastPlayedPost) {
    newState.lastPlayedPost = state.lastPlayedPost;
  }

  await setUserState(userId, newState);
  return newState;
}

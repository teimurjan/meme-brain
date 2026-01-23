export type PostStats = {
  postId: string;
  total: number;
  countsByArchetype: Record<string, number>;
};

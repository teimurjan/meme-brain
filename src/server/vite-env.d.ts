interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_APP_SUBREDDIT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

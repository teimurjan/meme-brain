/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_STAGE: 'production' | 'development';
  readonly VITE_APP_SUBREDDIT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

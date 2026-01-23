/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_STAGE: 'production' | 'development';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

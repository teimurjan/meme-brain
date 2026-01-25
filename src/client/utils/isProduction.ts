export function isProduction() {
  return import.meta.env.VITE_STAGE === 'production';
}

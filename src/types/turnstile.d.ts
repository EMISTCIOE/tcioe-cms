// Cloudflare Turnstile TypeScript declarations
interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

interface Turnstile {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
  getResponse: (widgetId: string) => string;
}

interface Window {
  turnstile?: Turnstile;
}

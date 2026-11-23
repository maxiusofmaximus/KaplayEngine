import type { MapParams } from './map/generate';

export {};

declare global {
  interface Window {
    api?: {
      ping?: () => Promise<string>;
      loadConfig?: () => Promise<unknown>;
      saveConfig?: (params: MapParams) => Promise<boolean>;
    };
  }
}

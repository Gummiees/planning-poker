export const COOKIE_NAME = 'planning-poker-game';

export interface Game {
  readonly roomName: string;
  readonly username: string;
  players?: string[];
}

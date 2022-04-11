export const COOKIE_NAME = 'planning-poker-game';

export interface Game {
  readonly room: string;
  readonly username: string;
  isHost?: boolean;
  players?: string[];
}

export interface PlayerJoined {
  room: string;
  player: string;
}

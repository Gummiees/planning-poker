import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { COOKIE_NAME, Game } from '../join-game/game.model';
import { IoSocketService } from './io-socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentGame: Game | null = null;
  private readonly _joinGame$ = new BehaviorSubject<Game | null>(this.currentGame);

  public constructor(
    private readonly ioSocketService: IoSocketService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
  ) {
    if (this.doesCookieExist()) {
      const game = JSON.parse(this.cookieService.get(COOKIE_NAME));
      this.setCurrentGame(game);
    }
  }

  public get joinGame$(): Observable<Readonly<Game | null>> {
    return this._joinGame$.asObservable();
  }

  public async joinGame(game: Game) {
    try {
      game.players = await this.ioSocketService.joinRoom(game.roomName, game.username);
      this.setCurrentGame(game);
      this._joinGame$.next(game);
    } catch (e) {
      throw e;
    }
  }

  public async createGame(username: string) {
    const roomName = await this.ioSocketService.createRoom(username);
    const game: Game = {
      username,
      roomName,
      players: [username],
    };

    this.setCurrentGame(game);
    this._joinGame$.next(game);
    await this.router.navigate(['room', game.roomName]);
  }

  public async doesGameExist(room: string): Promise<boolean> {
    return this.ioSocketService.doesRoomExist(room);
  }

  public exitGame() {
    this.currentGame = null;
    this._joinGame$.next(null);
    this.cookieService.set(COOKIE_NAME, '');
    this.ioSocketService.disconnect();
  }

  private setCurrentGame(game: Game) {
    if (!this.isCookieSameRoomName(game)) {
      this.cookieService.set(COOKIE_NAME, JSON.stringify(game));
    }

    this.currentGame = game;
  }

  private doesCookieExist(): boolean {
    const cookie = this.cookieService.get(COOKIE_NAME);
    const cookieGame = cookie ? JSON.parse(cookie) : null;
    return !!cookieGame;
  }

  private isCookieSameRoomName(game: Game | null): boolean {
    if (!game || !this.doesCookieExist()) {
      return false;
    }
    const cookie = this.cookieService.get(COOKIE_NAME);
    const cookieGame = cookie ? JSON.parse(cookie) : null;
    return cookieGame && cookieGame.roomName === game.roomName;
  }
}

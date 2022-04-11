import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { COOKIE_NAME, Game } from './game.model';

@Injectable({
  providedIn: 'root',
})
export class JoinGameService {
  private currentGame: Game | null = null;
  private readonly _joinGame$ = new BehaviorSubject<Game | null>(this.currentGame);

  public constructor(private readonly cookieService: CookieService) {
    if (this.doesCookieExist()) {
      const game = JSON.parse(this.cookieService.get(COOKIE_NAME));
      this.setGame(game);
    }
  }

  public get joinGame$(): Observable<Readonly<Game | null>> {
    return this._joinGame$.asObservable();
  }

  public setGame(game: Game) {
    if (!this.isCookieSameRoomName(game)) {
      this.cookieService.set(COOKIE_NAME, JSON.stringify(game));
    }

    this.currentGame = game;
    this._joinGame$.next(game);
  }

  public exitGame() {
    this.currentGame = null;
    this._joinGame$.next(null);
    this.cookieService.set(COOKIE_NAME, '');
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

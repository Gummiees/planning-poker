import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, filter, map, Observable, Subscription } from 'rxjs';
import { COOKIE_NAME, Game, PlayerJoined } from '../join-game/game.model';
import { IoSocketService } from './io-socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentGame: Game | null = null;
  private readonly _joinGame$ = new BehaviorSubject<Game | null>(this.currentGame);

  private subscription?: Subscription;

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
      game.players = await this.ioSocketService.joinRoom(game.room, game.username);
      game.isHost = false;
      this.listenForPlayers();
      this.setCurrentGame(game);
    } catch (e) {
      throw e;
    }
  }

  public async createGame(username: string) {
    const room = await this.ioSocketService.createRoom(username);
    const game: Game = {
      username,
      room,
      isHost: true,
      players: [username],
      status: 'waiting',
    };

    this.listenForPlayers();
    this.setCurrentGame(game);
    await this.router.navigate(['room', game.room]);
  }

  public startGame() {
    this.ioSocketService.startGame(this.currentGame?.room ?? '');
  }

  public async doesGameExist(room: string): Promise<boolean> {
    return this.ioSocketService.doesRoomExist(room);
  }

  public exitGame() {
    this.currentGame = null;
    this._joinGame$.next(null);
    this.cookieService.set(COOKIE_NAME, '');
    this.ioSocketService.disconnect();
    this.subscription?.unsubscribe();
  }

  private listenForPlayers() {
    this.subscription = this.ioSocketService
      .playerJoinedRoom()
      .pipe(
        filter((playerJoined: PlayerJoined) => playerJoined.room === this.currentGame?.room),
        map((playerJoined: PlayerJoined) => playerJoined.player),
      )
      .subscribe((username: string) => {
        if (this.currentGame) {
          this.currentGame.players?.push(username);
          this._joinGame$.next(this.currentGame);
        }
      });
  }

  private setCurrentGame(game: Game) {
    if (!this.isCookieSameRoom(game)) {
      if (this.doesCookieExist()) {
        this.cookieService.set(COOKIE_NAME, '');
      }
      this.cookieService.set(COOKIE_NAME, JSON.stringify(game));
    }
    if (!game.players) {
      game.players = [];
    }
    this.currentGame = game;
    this._joinGame$.next(game);
  }

  private doesCookieExist(): boolean {
    const cookie = this.cookieService.get(COOKIE_NAME);
    const cookieGame = cookie ? JSON.parse(cookie) : null;
    return !!cookieGame;
  }

  private isCookieSameRoom(game: Game | null): boolean {
    if (!game || !this.doesCookieExist()) {
      return false;
    }
    const cookie = this.cookieService.get(COOKIE_NAME);
    const cookieGame = cookie ? JSON.parse(cookie) : null;
    return cookieGame && cookieGame.room === game.room;
  }
}

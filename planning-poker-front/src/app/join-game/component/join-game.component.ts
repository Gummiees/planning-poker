import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../../shared/game.service';
import { Game } from '../game.model';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
})
export class JoinGameComponent implements OnInit, OnDestroy {
  public room?: string;
  public game: Game | null = null;
  public isReadyToPlay = false;

  private subscription?: Subscription;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly gameService: GameService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.subscribeToJoinGame();
  }

  public async ngOnInit() {
    this.room = this.route.snapshot.paramMap.get('room-name') ?? '';
    if (!this.room) {
      await this.returnHome();
    }
    if (this.isHost()) {
      return;
    }

    const doesGameExist = await this.gameService.doesGameExist(this.room);
    if (!doesGameExist) {
      await this.returnHome();
    }
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private isHost(): boolean {
    return this.game?.isHost === true;
  }

  private subscribeToJoinGame() {
    this.subscription = this.gameService.joinGame$.subscribe((game) => {
      this.game = game;
    });
  }

  private async returnHome() {
    this.snackBar.open('Room does not exist', 'Close');
    await this.router.navigate(['/']);
  }
}

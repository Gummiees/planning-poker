import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameService } from '@shared/game.service';
import { filter, Subscription } from 'rxjs';
import { Game } from '../../game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements OnDestroy {
  public isProcessing = false;
  public game: Game | null = null;
  public roomUrl: string | null = null;

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private readonly gameService: GameService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.subscribeToGame();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public async exit() {
    this.gameService.exitGame();
    await this.router.navigate(['/']);
  }

  public start() {
    console.log('start');
  }

  public async copyToClipbard() {
    if (!this.roomUrl) {
      return;
    }
    await navigator.clipboard.writeText(this.roomUrl);
    this.snackBar.open('Copied!', 'Close');
  }

  private subscribeToGame() {
    const sub = this.gameService.joinGame$.pipe(filter((game) => !!game)).subscribe((game) => {
      this.game = game;
      this.roomUrl = `${window.location.origin}/public/room/${game?.room}`;
    });
    this.subscriptions.push(sub);
  }
}

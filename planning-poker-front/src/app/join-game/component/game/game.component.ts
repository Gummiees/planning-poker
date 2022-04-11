import { Component, OnDestroy } from '@angular/core';
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

  private readonly subscription?: Subscription;

  public constructor(private readonly gameService: GameService) {
    this.subscription = this.gameService.joinGame$
      .pipe(filter((game) => !!game))
      .subscribe((game) => {
        this.game = game;
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public exit() {
    this.gameService.exitGame();
  }
}

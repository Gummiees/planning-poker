import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Game } from '../../game.model';
import { JoinGameService } from '../../join-game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements OnDestroy {
  public isProcessing = false;
  public game: Game | null = null;

  private readonly subscription?: Subscription;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly joinGameService: JoinGameService,
  ) {
    this.subscription = this.joinGameService.joinGame$
      .pipe(filter((game) => !!game))
      .subscribe((game) => {
        this.game = game;
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public exit() {
    this.joinGameService.exitGame();
  }
}

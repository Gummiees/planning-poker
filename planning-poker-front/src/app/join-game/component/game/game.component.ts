import { Component, OnDestroy } from '@angular/core';
import { IoSocketService } from '@shared/io-socket.service';
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

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private readonly ioSocketService: IoSocketService,
    private readonly joinGameService: JoinGameService,
  ) {
    const joinGameSub = this.joinGameService.joinGame$
      .pipe(filter((game) => !!game))
      .subscribe((game) => {
        this.game = game;
      });
    this.ioSocketService.connect();
    const ioSocketSub = this.ioSocketService
      .something$()
      .subscribe((what) => console.log('what', what));
    this.subscriptions.push(joinGameSub);
    this.subscriptions.push(ioSocketSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public exit() {
    this.joinGameService.exitGame();
  }
}

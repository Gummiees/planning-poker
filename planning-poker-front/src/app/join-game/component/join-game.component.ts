import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from '../../shared/game.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
})
export class JoinGameComponent implements OnInit, OnDestroy {
  public roomName?: string;
  public isReadyToPlay = false;

  private readonly subscription?: Subscription;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly gameService: GameService,
  ) {
    this.subscription = this.gameService.joinGame$.subscribe((game) => {
      if (!game) {
        this.isReadyToPlay = false;
      } else {
        this.isReadyToPlay = true;
      }
    });
  }

  public ngOnInit(): void {
    this.roomName = this.route.snapshot.paramMap.get('room-name') ?? '';
    if (!this.roomName) {
      void this.router.navigate(['/']);
    }
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

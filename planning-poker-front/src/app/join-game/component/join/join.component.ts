import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../../shared/game.service';
import { Game } from '../../game.model';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
})
export class JoinComponent implements OnInit {
  public form: FormGroup;
  public isProcessing = false;
  @Input() public roomName?: string;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly gameService: GameService,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  public ngOnInit(): void {
    this.roomName = this.route.snapshot.paramMap.get('room-name') ?? '';
  }

  public async sendForm() {
    if (this.form.valid) {
      this.isProcessing = true;
      this.form.disable();
      const game: Game = {
        roomName: this.roomName || '',
        username: this.form.controls.name.value,
      };
      try {
        await this.gameService.joinGame(game);
      } catch (e) {
        console.error('Error joining the room', e);
        this.form.enable();
        this.isProcessing = false;
      }
    }
  }
}

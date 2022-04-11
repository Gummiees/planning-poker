import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @Input() public room?: string;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly gameService: GameService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  public ngOnInit(): void {
    this.room = this.route.snapshot.paramMap.get('room-name') ?? '';
  }

  public async sendForm() {
    if (this.form.valid) {
      this.isProcessing = true;
      this.form.disable();
      const game: Game = {
        room: this.room || '',
        username: this.form.controls.name.value,
        status: 'waiting',
      };
      try {
        await this.gameService.joinGame(game);
      } catch (e) {
        this.snackBar.open('Error joining the room', 'Close');
        console.error('Error joining the room', e);
        this.form.enable();
        this.isProcessing = false;
      }
    }
  }
}

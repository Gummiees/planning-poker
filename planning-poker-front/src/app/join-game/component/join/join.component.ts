import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../../game.model';
import { JoinGameService } from '../../join-game.service';

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
    private readonly joinGameService: JoinGameService,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  public ngOnInit(): void {
    this.roomName = this.route.snapshot.paramMap.get('room-name') ?? '';
  }

  public sendForm() {
    if (this.form.valid) {
      this.isProcessing = true;
      this.form.disable();
      setTimeout(() => {
        const cookie: Game = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          roomName: this.roomName!,
          name: this.form.controls.name.value,
        };
        this.joinGameService.setGame(cookie);
        this.form.enable();
        this.isProcessing = false;
      }, 3000);
    }
  }
}

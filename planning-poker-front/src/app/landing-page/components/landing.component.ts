import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from '@shared/game.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  public form: FormGroup;
  public isProcessing = false;

  public constructor(private readonly gameService: GameService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  public async sendForm() {
    if (this.form.valid) {
      this.isProcessing = true;
      this.form.disable();
      try {
        const username = this.form.controls.name.value;
        await this.gameService.createGame(username);
      } catch (e) {
        this.form.enable();
        this.isProcessing = false;
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
})
export class JoinGameComponent implements OnInit {
  public form: FormGroup;
  public isProcessing = false;
  public uuid?: string;

  public constructor(private readonly route: ActivatedRoute) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  public ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
  }

  public sendForm() {
    if (this.form.valid) {
      this.isProcessing = true;
      this.form.disable();
      setTimeout(() => {
        this.form.enable();
        this.isProcessing = false;
      }, 3000);
    }
  }
}

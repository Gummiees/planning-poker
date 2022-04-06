import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  public form: FormGroup;
  public isProcessing = false;

  public constructor() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
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

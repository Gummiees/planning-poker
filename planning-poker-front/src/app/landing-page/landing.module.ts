import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LandingComponent } from './components/landing.component';
import { LandingRoutingModule } from './landing.routes';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, SharedModule],
})
export class LandingModule {}

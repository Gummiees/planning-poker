import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { JoinGameComponent } from './component/join-game.component';
import { JoinGameRoutingModule } from './join-game.routes';

@NgModule({
  declarations: [JoinGameComponent],
  imports: [CommonModule, JoinGameRoutingModule, SharedModule],
})
export class JoinGameModule {}

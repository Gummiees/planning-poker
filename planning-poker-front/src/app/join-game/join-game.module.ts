import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GameComponent } from './component/game/game.component';
import { JoinGameComponent } from './component/join-game.component';
import { JoinComponent } from './component/join/join.component';
import { JoinGameRoutingModule } from './join-game.routes';

@NgModule({
  declarations: [JoinGameComponent, JoinComponent, GameComponent],
  imports: [CommonModule, JoinGameRoutingModule, SharedModule],
})
export class JoinGameModule {}

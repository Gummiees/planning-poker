import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: async () => import('./landing-page/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'room/:uuid',
    loadChildren: async () => import('./join-game/join-game.module').then((m) => m.JoinGameModule),
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

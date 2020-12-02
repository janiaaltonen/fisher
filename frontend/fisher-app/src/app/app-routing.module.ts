import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from '@app/sign-up/sign-up.component';
import {AppComponent} from './app.component';
import { AuthGuard } from './_helpers';

const fishingStatsModule = () => import('./fishing-stats/fishing-stats.module').then(x => x.FishingStatsModule);

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'events', loadChildren: fishingStatsModule, canActivate: [AuthGuard] },
  { path: 'signup', component: SignUpComponent },
  // { path: '', pathMatch: 'full', redirectTo: 'events' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

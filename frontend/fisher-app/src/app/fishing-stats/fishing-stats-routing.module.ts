import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from '@app/fishing-stats/list.component';
import {DetailsComponent} from '@app/fishing-stats/details.component';
import {LayoutComponent} from '@app/fishing-stats/layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ListComponent },
      { path: 'details/:id', component: DetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FishingStatsRoutingModule { }

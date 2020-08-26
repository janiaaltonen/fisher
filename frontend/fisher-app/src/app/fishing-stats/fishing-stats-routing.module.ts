import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from '@app/fishing-stats/list.component';

const routes: Routes = [
  {
    path: '', component: ListComponent,
    children: [
      { path: '', component: ListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FishingStatsRoutingModule { }

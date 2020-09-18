import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from '@app/fishing-stats/list.component';
import {DetailsComponent} from '@app/fishing-stats/details.component';
import {LayoutComponent} from '@app/fishing-stats/layout.component';
import {EditComponent} from '@app/fishing-stats/edit.component';
import {AddComponent} from '@app/fishing-stats/add.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ListComponent },
      { path: 'add', component: AddComponent },
      { path: 'details/:id', component: DetailsComponent },
      { path: 'details/:id/edit', component: EditComponent },
      { path: 'details/:id/methods/:methodIndex/edit', component: EditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FishingStatsRoutingModule { }

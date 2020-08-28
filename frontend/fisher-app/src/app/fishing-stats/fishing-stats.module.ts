import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import {FishingStatsRoutingModule} from '@app/fishing-stats/fishing-stats-routing.module';
import { DetailsComponent } from './details.component';
import { LayoutComponent } from './layout.component';



@NgModule({
  declarations: [ListComponent, DetailsComponent, LayoutComponent],
  imports: [
    CommonModule,
    FishingStatsRoutingModule
  ]
})
export class FishingStatsModule { }

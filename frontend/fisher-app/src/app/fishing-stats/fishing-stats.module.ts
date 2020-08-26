import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import {FishingStatsRoutingModule} from '@app/fishing-stats/fishing-stats-routing.module';



@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    FishingStatsRoutingModule
  ]
})
export class FishingStatsModule { }

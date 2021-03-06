import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import {FishingStatsRoutingModule} from '@app/fishing-stats/fishing-stats-routing.module';
import { DetailsComponent } from './details.component';
import { LayoutComponent } from './layout.component';
import { EditComponent } from './edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AddComponent } from './add.component';
import {CustomMaterialModule} from '@app/custom-material/custom-material.module';



@NgModule({
  declarations: [ListComponent, DetailsComponent, LayoutComponent, EditComponent, AddComponent],
  imports: [
    CommonModule,
    FishingStatsRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class FishingStatsModule { }

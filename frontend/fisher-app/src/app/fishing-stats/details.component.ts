import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FishingStatsService} from '@app/_services';
import { FishingEvent } from '@app/_models/fishing-event.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  id: string;
  fishingEvent: FishingEvent;

  constructor(private route: ActivatedRoute, private statService: FishingStatsService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.statService.getById(this.id).subscribe(data => {
      this.fishingEvent = data;
    });
  }

}

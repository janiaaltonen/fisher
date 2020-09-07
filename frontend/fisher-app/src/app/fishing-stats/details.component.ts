import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FishingStatsService} from '@app/_services';
import { FishingEvent } from '@app/_models/fishing-event.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  id: string;
  fishingEvent = new FishingEvent();

  constructor(private route: ActivatedRoute, private statService: FishingStatsService, private router: Router) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.statService.getEventById(this.id).subscribe(data => this.fishingEvent = data);
  }

  EditFishingEvent(): void {
    this.router.navigate(['edit/'], { relativeTo: this.route, state: {data: this.fishingEvent}});
  }

  deleteEvent(id): void {
    this.statService.deleteFishingEvent(id).subscribe(
      resp => {
        if (resp.status === 204) {
          this.router.navigate(['events/']);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}

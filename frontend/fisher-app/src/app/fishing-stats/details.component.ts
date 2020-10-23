import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FishingStatsService} from '@app/_services';
import { FishingEvent } from '@app/_models/fishing-event.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./list.component.css']
})
export class DetailsComponent implements OnInit {
  id: string;
  fishingEvent: FishingEvent;
  active = 0;

  constructor(private route: ActivatedRoute, private statService: FishingStatsService, private router: Router) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.statService.getEventById(this.id).subscribe(data => this.fishingEvent = data);
  }

  get statsLength() { return this.fishingEvent.stats.length; }

  get startTime() {
    if (this.fishingEvent.start_time) {
      return this.fishingEvent.start_time.substring(0, 5);
    }
  }

  get endTime() {
    if (this.fishingEvent.end_time) {
      return this.fishingEvent.end_time.substring(0, 5);
    }
  }

  get lure() {
    if (this.fishingEvent) {
      return this.fishingEvent.stats[this.active].lure;
    }
    return null;
  }

  editFishingMethod(statIndex): void {
    this.router.navigate([`methods/${statIndex}/edit`], { relativeTo: this.route, state: {data: this.fishingEvent}});
  }

  addNewFishingEvent(): void {
    const newIndex = -1;
    this.router.navigate([`methods/${newIndex}/edit`], { relativeTo: this.route, state: {data: this.fishingEvent}});
  }

  deleteStat(eventId, statIndex): void {
    this.statService.deleteStat(eventId, this.fishingEvent.stats[statIndex].id).subscribe(
      resp => {
        if (resp.status === 204) {
          this.fishingEvent.stats.splice(statIndex, 1);
          this.active = 0;
        }
      }
    );
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
  activateStat(index) {
    this.active = index;
  }
}

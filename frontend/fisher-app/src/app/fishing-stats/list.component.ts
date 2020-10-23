import { Component, OnInit } from '@angular/core';
import { FishingStatsService} from '@app/_services';
import {ActivatedRoute, Router} from '@angular/router';
import {FishingEventOverview} from '@app/_models/fishing-event-overview';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  fishingEvents: FishingEventOverview [];

  constructor(private stats: FishingStatsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.stats.getAll().subscribe(
      data => {
        this.fishingEvents = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  eventStartTime(startTime) {
    // start time is in string format hh:mm:ss
    // modify it if user has given one else time is null
    if (startTime) {
      startTime = startTime.substring(0, 5);
    }
    return startTime;
  }

  eventEndTime(endTime) {
    // end time is in string format hh:mm:ss
    // modify it if user has given one else time is null
    if (endTime) {
      endTime = endTime.substring(0, 5);
    }
    return endTime;
  }

  addNewEvent(): void {
    this.router.navigate(['add/'], {relativeTo: this.route});
  }

  deleteEvent(eventId) {
    this.stats.deleteFishingEvent(eventId).subscribe(
      resp => {
        if (resp.status === 204) {
          // now calls backend tho refresh list. Is it better than use local array to refresh page?!?
          this.getEvents();
        }
      },
        error => {
          console.log(error);
        }
    );
  }

  showDetails(eventId): void {
    this.router.navigate([`details/${eventId}`], {relativeTo: this.route});
  }

}

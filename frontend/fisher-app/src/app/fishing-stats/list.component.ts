import { Component, OnInit } from '@angular/core';
import { FishingStatsService} from '@app/_services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  fishingEvents: [
    {
      id: -1,
      date: '',
      location: '',
      persons: ''
    }];

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

  addNewEvent(): void {
    this.router.navigate(['add/'], {relativeTo: this.route});
  }

  deleteEvent(eventId) {
    this.stats.deleteFishingEvent(eventId).subscribe(
      resp => {
        if (resp.status === 204) {
          // refresh page, load list again to be decided
        }
      }
    );
  }

}

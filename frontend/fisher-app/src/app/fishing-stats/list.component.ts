import { Component, OnInit } from '@angular/core';
import { FishingStatsService} from '@app/_services';

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
      location: ''
    }];

  constructor(private stats: FishingStatsService) { }

  ngOnInit(): void {
    this.stats.getAll().subscribe(
      data => {
        this.fishingEvents = data;
      },
      error => {
        console.log(error);
      }
    );
  }

}

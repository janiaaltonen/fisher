import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fisher-app';

  constructor(private router: Router) {
  }

  toEvents() {
    this.router.navigate(['events']);
  }

  createEvent() {
    this.router.navigate(['events/add']);
  }
}

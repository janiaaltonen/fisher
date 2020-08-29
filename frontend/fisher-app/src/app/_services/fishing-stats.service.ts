import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FishingStatsService {
  private baseUrl = 'http://127.0.0.1:8000';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + '/events');
  }
  getEventById(id): Observable<any>{
    return this.http.get(this.baseUrl + '/events/details/' + id + '/');
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FishingStatsService {
  private baseUrl = 'http://localhost:8000';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  // quick fix to make front work with api

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + '/events');
  }
  getEventById(id): Observable<any>{
    return this.http.get(this.baseUrl + '/events/details/' + id + '/');
  }

  createEvent(eventObj): Observable<any> {
    return this.http.post(this.baseUrl + '/events/create', eventObj, {headers: this.httpHeaders});
  }

  getFormOptions(): Observable<any> {
    return this.http.get(this.baseUrl + '/formOptions/');
  }

  deleteFishingEvent(id): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${id}/`, { observe: 'response'});
  }
}

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
  private httpHeaders2 = new HttpHeaders({'x-CSRFTOKEN': 'a2Rs8viYx7xpuOAlJuGUVd0INzjdibiMmEjGBqScmZWIurKM8vZ9NEZ7nNX77BRf'});

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + '/events');
  }
  getEventById(id): Observable<any>{
    return this.http.get(this.baseUrl + '/events/details/' + id + '/');
  }

  createEvent(eventObj): Observable<any> {
    return this.http.post(this.baseUrl + '/events/create', eventObj, {headers: this.httpHeaders2});
  }

  getFormOptions(): Observable<any> {
    return this.http.get(this.baseUrl + '/formOptions/');
  }

  deleteFishingEvent(id): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${id}/`, { observe: 'response'});
  }

  deleteStat(eventId, statId): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${eventId}/stats/${statId}/`, {observe: 'response'});
  }

  deleteCatch(eventId, catchId): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${eventId}/catches/${catchId}/`, {observe: 'response'});
  }
}

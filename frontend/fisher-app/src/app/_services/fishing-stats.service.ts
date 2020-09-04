import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FishingStatsService {
  private baseUrl = 'http://127.0.0.1:8000';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  // quick fix to make front work with api
  private httpHeaders2 = new HttpHeaders({'X-CSRFTOKEN': 'T7Ig9fH7a1GK2vZMlv034JV4S2knIgAPSCNgOV27WknqeWYNJgFVsdgxX9RtYJcj'});

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
}

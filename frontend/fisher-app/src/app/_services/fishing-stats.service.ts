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
  private httpHeaders2 = new HttpHeaders({'X-CSRFTOKEN': 'Vt8bdg3GGK8APgeuKs6EnGtHQkGEBaKY492F8Z3aJo5IdVEeHHgpRj4LqnTs0XGK'});

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

  updateFishingEvent(id, event): Observable<any> {
    return this.http.put(this.baseUrl + `/events/details/${id}/`, event, { headers: this.httpHeaders2, observe: 'response'});
  }

  deleteFishingEvent(id): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${id}/`, { headers: this.httpHeaders2, observe: 'response'});
  }

  deleteStat(eventId, statId): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${eventId}/stats/${statId}/`,
      {headers: this.httpHeaders2, observe: 'response'});
  }

  deleteCatch(eventId, catchId): Observable<any> {
    return this.http.delete(this.baseUrl + `/events/details/${eventId}/catches/${catchId}/`, {headers: this.httpHeaders2, observe: 'response'});
  }
}

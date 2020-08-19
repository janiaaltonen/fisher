import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = '127.0.0.1:8000';
  httpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    this.httpHeaders.set('Content-type', 'application/x-www-form-urlencoded');
    const body = {
      username: 'jani',
      password: 'jani'
    };
    return this.http.post(this.baseUrl + '/auth', body, {headers: this.httpHeaders});
  }
}

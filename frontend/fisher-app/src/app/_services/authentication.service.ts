import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'http://127.0.0.1:8000';
  httpHeaders = new HttpHeaders();
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }
  public get userValue(): any {
    return this.userSubject.value;
  }

  login(user, pass): Observable<any> {
    this.httpHeaders.set('Content-type', 'application/x-www-form-urlencoded');
    const body = {
      username: user,
      password: pass
    };
    return this.http.post(this.baseUrl + '/auth', body, {headers: this.httpHeaders, withCredentials: true})
      .pipe(map(data => {
        localStorage.setItem('user', JSON.stringify(data));
        this.userSubject.next(data);
        return data;
      }));
  }
}

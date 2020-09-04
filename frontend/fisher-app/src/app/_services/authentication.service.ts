import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'http://127.0.0.1:8000';
  httpHeaders = new HttpHeaders();
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }
  public get userValue(): any {
    return this.userSubject.value;
  }

  login(user, pass): Observable<any> {
    const body = {
      username: user,
      password: pass
    };
    return this.http.post(this.baseUrl + '/auth', body, {headers: this.httpHeaders, observe: 'response'})
      .pipe(map(resp => {
        console.log(resp.headers.keys());
        localStorage.setItem('user', JSON.stringify(resp.body));
        this.userSubject.next(resp.body);
        return resp.body;
      }));
  }
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  obtainAccessToken(): Observable<any> {
    const body = null;
    return this.http.post(this.baseUrl + '/refresh', body);
  }
}

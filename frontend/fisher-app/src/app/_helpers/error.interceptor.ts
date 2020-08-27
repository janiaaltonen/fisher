import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, first, switchMap, tap} from 'rxjs/operators';
import {AuthenticationService} from '@app/_services';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403 && err.error.detail === 'Access credentials were not provided') {
            console.log('HERE');
            return this.handleThis(request, next);
          }
        }
        return throwError(err);
      }));
  }
  handleThis(request: HttpRequest<any>, next: HttpHandler) {
    return this.auth.obtainAccessToken().pipe(
      switchMap((data: string) => {
        if (data) {
          request = request.clone();
          return next.handle(request);
        }
      }));
  }
}

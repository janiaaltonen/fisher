import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { FishingStatsService } from '../_services/';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor( private stats: FishingStatsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true,
    });
    return next.handle(request);
  }
}

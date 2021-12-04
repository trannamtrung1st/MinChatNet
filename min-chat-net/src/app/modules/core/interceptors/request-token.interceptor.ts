import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class RequestTokenInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      const token = `Bearer ${accessToken}`;
      const modifiedHeaderReq = req.clone({
        headers: req.headers.set('Authorization', token)
      });
      return next.handle(modifiedHeaderReq);
    }
    return next.handle(req);
  }
}

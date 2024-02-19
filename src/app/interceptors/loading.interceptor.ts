import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { finalize, catchError, delay, mergeMap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true);
    return of(null).pipe(
      delay(500),
      mergeMap(() => next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        }),
        finalize(() => {
          this.loadingService.setLoading(false);
        })
      ))
    );
  }
}

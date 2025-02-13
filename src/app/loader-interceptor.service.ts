import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService  implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('LoaderInterceptor: Intercepting request', req.url);
    this.loaderService.show();
    return next.handle(req).pipe(
      finalize(() => {
        console.log('LoaderInterceptor: Finalizing request', req.url);
        this.loaderService.hide();
      })
    );
  }
}

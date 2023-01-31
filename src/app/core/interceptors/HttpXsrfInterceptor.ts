import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor
{
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestMethod: string = req.method;
    requestMethod = requestMethod.toLowerCase();

    if (requestMethod && (requestMethod === 'post' || requestMethod === 'delete' || requestMethod === 'put')) {
      const headerName = 'X-XSRF-TOKEN';
      console.log(document.cookie)
      let token = this.tokenExtractor.getToken() as string;
      console.log("token: ", token)
      if (token !== null && !req.headers.has(headerName)) {
        req = req.clone({headers: req.headers.set(headerName, token)});
      }
    }

    return next.handle(req);
  }
}

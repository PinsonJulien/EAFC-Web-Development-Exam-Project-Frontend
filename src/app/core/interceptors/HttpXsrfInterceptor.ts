import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, lastValueFrom, mergeMap, Observable } from "rxjs";
import CsrfService from "../services/CsrfService";

@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor
{
  constructor(private tokenExtractor: HttpXsrfTokenExtractor, private csrfService: CsrfService) {}

  /**
   * Intercept every requests made, will get a new CSRF token if the action needs it.
   * This token is read from the cookies and set as a header for the intercepted request.
   * Solution inspired by : https://stackoverflow.com/questions/43349948/angular-2-spring-security-csrf-token/44722979#44722979
   * But modernized.
   *
   * @param req
   * @param next
   * @returns
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestMethod: string = req.method.toUpperCase();

    // GET request don't need the csrf
    if (requestMethod === 'GET') return next.handle(req);

    // Every other request actions will:
    // 1) fetch a new CSRF token
    // 2) apply it to the header of the intercepted request.

    const headerName = 'X-XSRF-TOKEN';

    return from(this.getCsrfToken()).pipe(
      mergeMap((token) => {
        if (token !== null && !req.headers.has(headerName)) {
          req = req.clone({headers: req.headers.set(headerName, token)});
        }

        return next.handle(req);
      })
    );
  }

  protected async getCsrfToken() : Promise<string>
  {
    await lastValueFrom(this.csrfService.getToken());

    return this.tokenExtractor.getToken() as string;
  }
}

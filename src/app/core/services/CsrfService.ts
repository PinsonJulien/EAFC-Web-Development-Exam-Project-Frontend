import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export default class CsrfService
{
  private readonly url = `//${environment.baseUrl}`;

  constructor(private http: HttpClient)
  {

  }

  public getToken()
  {
    return this.http.get(`${this.url}/sanctum/csrf-cookie`)
      .pipe(
        map( (response: any) => {
          console.log("cookie : ", document.cookie);
          return response;
        })
      );
  }


  public test() {
    const req = this.http.post(`${this.url}/api/v1/courses`, {}, {
      /*headers: {
        'X-XSRF-TOKEN' : "eyJpdiI6IkJxbFAvK3BiNDkwb0xYejA3Q0FjT0E9PSIsInZhbHVlIjoiRDRIZVpMRVF5WEVDeERlM1ZGUkF1UTJqVXVyVWJ3bmFHc3BXYkVRQ2NIQmFrQitKZVlPZ3NPaEJ5ZnVEenRCQlBSb3gwQUpGaldkYWRrSHduNFNmNVE3UUQ4dCsyV1hJSS96WUg5bW5vWUYyY2c0YTlPZWo5OHBlYm1pZEwrZmwiLCJtYWMiOiJmZWFhOTkzMjllYjNiZTkwYzZjYzc1MGQzMmNhOWQ0OGVkZDhiNzkzMWVjZGNiODlhNGVjMmY4YzZjOGIyMTA1IiwidGFnIjoiIn0%3D; expires=Tue, 31 Jan 2023 15:11:40 GMT; Max-Age=7200; path=/; httponly; samesite=lax"
      }*/
    })

    return req;
  }

}

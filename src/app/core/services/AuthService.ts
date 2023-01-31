import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./ApiService";

@Injectable({providedIn: 'root'})
export default class AuthTestService extends ApiService
{

  public login(body: {email: string, password: string})
  {
    console.log('prout')
    return this.http.post(`${this.apiURL}/auth/login`, body, this.httpOptions);
  }

}

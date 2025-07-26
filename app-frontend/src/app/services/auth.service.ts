import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export class backendService {

  protected readonly baseUrl = 'http://localhost:3001/api';

  constructor(protected readonly http: HttpClient, protected readonly resource: string) { }

}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends backendService {

  constructor(http: HttpClient) { 
    super(http, 'auth') 
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.resource}/login`, credentials);
  }
}

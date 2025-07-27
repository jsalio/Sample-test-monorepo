import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppResponse, UserWithoutPwd } from '../types/app.type';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3001/api/account'; // Update with your actual API endpoint

    constructor(private http: HttpClient) { }

    getUsers(): Observable<AppResponse<Array<UserWithoutPwd>>> {
        return this.http.get<AppResponse<Array<UserWithoutPwd>>>(this.apiUrl+ '/users'); // Assuming the endpoint for users is /users
    }
}

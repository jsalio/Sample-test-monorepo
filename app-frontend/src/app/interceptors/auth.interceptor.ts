import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Get the token from localStorage
        const userData: any = localStorage.getItem('userData');

        console.log("User Data from localStorage:", userData);
        if (userData) {
            // Clone the request and add the authorization header
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userData.token}` // Assuming userData contains a token property
                }
            });
        }

        // Handle the request and catch any errors
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // If we get an unauthorized error, redirect to login
                    localStorage.removeItem('userToken');
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}

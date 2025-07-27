import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { routes } from './app.routes';
import { LoginData, AppResponse } from './types/app.type';

const authInterceptor: HttpInterceptorFn = (req, next) => {


  const validateIfTokenExpired = ():{expired:boolean, token:string} => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData: AppResponse<LoginData> = JSON.parse(userData);
      const token:string = parsedData.token || '';
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded Token:", decodedToken);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return {expired:decodedToken.exp > currentTime, token}; // Check if token is still valid
    }
    return {expired: true, token:''};
  }

  const userData = localStorage.getItem('userData');
  const n = validateIfTokenExpired();
  if (!n.expired) {
    console.warn("Token is expired, redirecting to login.");
    const router = inject(Router);
    router.navigate(['/login']); // If token is expired, do not proceed with the request
    return next({} as any); // Return an empty observable to stop the request
  }
  console.log("User Data from localStorage 2:", n.token);
  if (userData) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${n.token}`
      }
    });
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};

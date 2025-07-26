import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { SiteComponent } from './modules/site/site.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'site',
        component: SiteComponent
    }
];

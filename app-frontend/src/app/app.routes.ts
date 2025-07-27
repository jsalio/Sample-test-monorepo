import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { SiteComponent } from './modules/site/site.component';
import { UsersListComponent } from './modules/users/users-list.component';

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
        component: SiteComponent,
        children: [
            {
                path: 'users',
                component: UsersListComponent
            }
        ]
    },

];

import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { OfficeListComponent } from './office/office-list/office-list.component';
import { InfoComponent } from './info/info.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'offices', component: OfficeListComponent}
        ]
    },
    {path: 'info', component: InfoComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];

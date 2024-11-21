import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { OfficeListComponent } from './office/office-list/office-list.component';
import { InfoComponent } from './info/info.component';
import { OfficeDetailComponent } from './office/office-detail/office-detail.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';
import { RegisterComponent } from './register/register.component';
import { AppointmentDetailComponent } from './appointment/appointment-detail/appointment-detail.component';
import { ResultListComponent } from './result/result-list/result-list.component';
import { ResultDetailComponent } from './result/result-detail/result-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { VerificationListComponent } from './admin/verification-list/verification-list.component';
import { adminGuard } from './_guards/admin.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'offices', component: OfficeListComponent},
            {path: 'offices/:id', component: OfficeDetailComponent},
            {path: 'appointments', component: AppointmentListComponent},
            {path: 'appointments/:id', component: AppointmentDetailComponent},
            {path: 'results', component: ResultListComponent},
            {path: 'results/:id', component: ResultDetailComponent},
            {path: 'profile', component: ProfileComponent},
            {path: 'admin', component: VerificationListComponent, canActivate: [adminGuard]},
        ]
    },
    {path: 'info', component: InfoComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];

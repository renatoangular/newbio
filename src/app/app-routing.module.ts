import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Route guards
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
// Page components
import { HomeComponent } from './pages/home/home.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { MyRsvpsComponent } from './pages/my-rsvps/my-rsvps.component';
import { DonComponent } from './pages/admin/don.component';
import { EventComponent } from './pages/donations/event.component'
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuardService } from './auth-guard.service';
import { RegisterFormComponent } from './pages/register-form/register-form.component'


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'event/:id',
    loadChildren: './pages/event/event.module#EventModule',
  //  canActivate: [
  //    AuthGuard
  //  ]
  },
  {
    path: 'donations/:id',
    loadChildren: './pages/donations/event.module#EventModule',
 //   canActivate: [
  //    AuthGuard
 //   ]
  },

  {
    path: 'my-rsvps',
    component: MyRsvpsComponent,
  //  canActivate: [
  //    AuthGuard
   // ]
  },
  {
    path: '', component: HomeComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile', component: ProfileComponent // canActivate: [AuthGuardService]

  },

  {
    path: 'admin',
    loadChildren: './pages/admin/admin.module#AdminModule',
  //  canActivate: [
  //    AuthGuard // ,  AdminGuard
  //  ]
  },

  {
    path: 'donadmin',
    component: DonComponent,
 //   canActivate: [
 //     AuthGuard // ,AdminGuard
 //   ]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
//  providers: [
 //   AuthGuard // ,AdminGuard
 // ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

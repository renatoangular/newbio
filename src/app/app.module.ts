import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { MyRsvpsComponent } from './pages/my-rsvps/my-rsvps.component';
import { DonComponent } from './pages/admin/don.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuardService } from './auth-guard.service';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.5555service';
import { ToastComponent } from './core/toast/toast.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    MyRsvpsComponent,
    DonComponent,
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ToastComponent,
    RegisterFormComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot(),
    CoreModule.forRoot(),
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    })
  ],
  providers: [AuthService, UserService, AuthenticationService, ToastComponent,
    AuthGuardService],
  bootstrap: [AppComponent],

})
export class AppModule { }

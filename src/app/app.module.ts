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
import { AuthenticationService } from './authentication.service';
import { RegisterFormComponent } from './pages/register-form/register-form.component';

import { MaterialModule } from '@angular/material';

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
    RegisterFormComponent,
  ],
  imports: [
    BrowserModule,
    [MaterialModule],
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot(),
    CoreModule.forRoot(),
    FlashMessagesModule.forRoot()
  ],
  providers: [    AuthenticationService,
    AuthGuardService],
  bootstrap: [AppComponent],

})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../../core/core.module';
import { RouterModule } from '@angular/router';
import {DONATIONS_ROUTES } from './donations.routes';
import {DonationsComponent } from './donations.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(DONATIONS_ROUTES)
  ],
  declarations: [
    DonationsComponent
  ]
})
export class DonationsModule { }

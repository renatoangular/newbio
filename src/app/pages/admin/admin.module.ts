import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../../core/core.module';
import { RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from './admin.routes';
import { AdminComponent } from './admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { UpdateDonationComponent } from './update-donation/update-donation.component';
import { EventFormComponent } from './event-form/event-form.component';
import { DonationsFormComponent } from './donations-form/donations-form.component';

import { DonationsForm1Component } from './donations-form1/donations-form1.component';
import { DeleteEventComponent } from './update-event/delete-event/delete-event.component';
import { DeleteDonationComponent } from './update-donation/delete-donation/delete-donation.component'
import {CreateDonationsComponent} from './create-donations/create-donations.component';
import {CreateDonations1Component} from './create-donations1/create-donations1.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(ADMIN_ROUTES)
  ],
  declarations: [
    AdminComponent,
    CreateEventComponent,
    CreateDonationsComponent,
    CreateDonations1Component,
    UpdateDonationComponent,
    UpdateEventComponent,
    EventFormComponent,
    DonationsFormComponent,
    DonationsForm1Component,
    DeleteEventComponent,
    DeleteDonationComponent
  ]
})
export class AdminModule { }

import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { UpdateDonationComponent } from './update-donation/update-donation.component';
import {CreateDonationsComponent} from './create-donations/create-donations.component';
import { CreateDonations1Component } from './create-donations1/create-donations1.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'event/new',
    component: CreateEventComponent
  },
  {
    path: 'event/update/:id',
    component: UpdateEventComponent
  },

  {
    path: 'donations/update/:id',
    component: UpdateDonationComponent
  },
  {
    path: 'donations/new',
    component: CreateDonationsComponent
  },
  {
    path: 'donations1/new',
    component: CreateDonations1Component
  },

  {
    path: 'donations',
    component: CreateDonationsComponent
  }



];

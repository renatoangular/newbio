import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import {CreateDonationsComponent} from './create-donations/create-donations.component';

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
    path: 'donations/new',
    component: CreateDonationsComponent
  }



];

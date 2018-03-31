import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../../core/core.module';
import { RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from './admin.routes';
import { AdminComponent } from './admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { DonationsFormComponent } from './donations-form/donations-form.component';
import { DeleteEventComponent } from './update-event/delete-event/delete-event.component';
import {CreateDonationsComponent} from './create-donations/create-donations.component';

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
    UpdateEventComponent,
    EventFormComponent,
    DonationsFormComponent,
    DeleteEventComponent
  ]
})
export class AdminModule { }

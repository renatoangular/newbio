import { Component, Input } from '@angular/core'; 
import { UtilsService } from './../../../core/utils.service';
import { EventModel } from './../../../core/models/event.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  @Input() event: EventModel;

  constructor(
    public utils: UtilsService,
    public auth: AuthService) { }
}

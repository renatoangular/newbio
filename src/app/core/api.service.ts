import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ENV } from './env.config';
import { EventModel } from './models/event.model';
import { RsvpModel } from './models/rsvp.model';
import { DcommentModel } from './models/dcomment.model';
import { RequestModel } from './models/request.model';
import { DonationsModel } from './models/donations.model';
import { ItemModel } from './models/item.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TokenPayload, UserDetails } from '../authentication.service';
import { RegisterModel } from './models/register.model';

@Injectable()
export class ApiService {

  private token: string;

  constructor(
    private flashMessage: FlashMessagesService,
    private http: HttpClient,
    private auth: AuthService) { }

  private get _authHeader(): string {
    console.log(`Bearer ${localStorage.getItem('access_token')}`);
    return `Bearer ${localStorage.getItem('access_token')}`;

  }
  // get user token
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  // GET list of public, future events
  getEvents$(): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}events`)
      .catch(this._handleError);
  }

  // GET list of public, future events
  geUsers$(): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}users`)
      .catch(this._handleError);
  }

  // GET list of donations
  getDonations$(): Observable<DonationsModel[]> {
    return this.http
      .get(`${ENV.BASE_API}donations`)
      .catch(this._handleError);
  }

  // GET list of donations
  getItems$(): Observable<ItemModel[]> {
    return this.http
      .get(`${ENV.BASE_API}items`)
      .catch(this._handleError);
  }

  // GET all events - private and public (admin only)
  getAdminEvents$(): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}events/admin`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET all donatiions - private and public (admin only)
  getAdminDonations$(): Observable<DonationsModel[]> {
    return this.http
      .get(`${ENV.BASE_API}donations/admin`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET an event by ID (login required)
  getEventById$(id: string): Observable<EventModel> {
    return this.http
      .get(`${ENV.BASE_API}event/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET an donation by ID (login required)
  getDonationsById$(id: string): Observable<DonationsModel> {
    return this.http
      .get(`${ENV.BASE_API}donations/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET RSVPs by event ID (login required)
  getRsvpsByEventId$(eventId: string): Observable<RsvpModel[]> {
    return this.http
      .get(`${ENV.BASE_API}event/${eventId}/rsvps`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET dcomment by event ID (login required)
  getDcommentsByEventId$(eventId: string): Observable<DcommentModel[]> {
    return this.http
      .get(`${ENV.BASE_API}event/${eventId}/dcomments`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET RSVPs by event ID (login required)
  getRequestsByDonationsId$(DonationsId: string): Observable<RequestModel[]> {
    return this.http
      .get(`${ENV.BASE_API}donations/${DonationsId}/requests`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new event (admin only)
  postEvent$(event: EventModel): Observable<EventModel> {
    return this.http
      .post(`${ENV.BASE_API}event/new`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // register User
  postRegister$(user: TokenPayload): Observable<TokenPayload> {
    return this.http
      .post(`${ENV.BASE_API}register`, user, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // login User
  postLogin$(user: TokenPayload): Observable<TokenPayload> {
    return this.http
      .post(`${ENV.BASE_API}login`, user,  {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }
  // get Profile    base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
  getProfile$(): Observable<any> {
    return this.http
      .get(`${ENV.BASE_API}profile`,  {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      })
      .catch(this._handleError);
      }


  // POST new donations (admin only)
  postDonations$(donations: DonationsModel): Observable<DonationsModel> {
    return this.http
      .post(`${ENV.BASE_API}donations/new`, donations, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new item (admin only)
  postItem$(item: ItemModel): Observable<ItemModel> {
    return this.http
      .post(`${ENV.BASE_API}item/new`, item, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing event (admin only)
  editEvent$(id: string, event: EventModel): Observable<EventModel> {
    return this.http
      .put(`${ENV.BASE_API}event/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

    // PUT existing event (admin only)
    editRegister$(id: string, register: RegisterModel): Observable<RegisterModel> {
      return this.http
        .put(`${ENV.BASE_API}register/${id}`, register, {
          headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .catch(this._handleError);
    }
  // PUT existing event (admin only)
  editDonations$(id: string, donations: DonationsModel): Observable<DonationsModel> {
    return this.http
      .put(`${ENV.BASE_API}donations/${id}`, donations, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // DELETE existing event and all associated RSVPs (admin only)
  deleteEvent$(id: string): Observable<any> {
    return this.http
      .delete(`${ENV.BASE_API}event/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // DELETE existing donation and all associated RSVPs (admin only)
  deleteDonations$(id: string): Observable<any> {
    return this.http
      .delete(`${ENV.BASE_API}donations/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // GET all events a specific user has RSVPed to (login required)
  getUserEvents$(userId: string): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}events/${userId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new RSVP (login required)
  postRsvp$(rsvp: RsvpModel): Observable<RsvpModel> {
    return this.http
      .post(`${ENV.BASE_API}rsvp/new`, rsvp, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new comment on item(login required)
  postDcomment$(dcomment: DcommentModel): Observable<DcommentModel> {
    return this.http
      .post(`${ENV.BASE_API}dcomment/new`, dcomment, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // POST new request (login required)
  postRequest$(request1: RequestModel): Observable<RequestModel> {
    return this.http
      .post(`${ENV.BASE_API}request/new`, request1, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }


  // PUT existing RSVP (login required)
  editRsvp$(id: string, rsvp: RsvpModel): Observable<RsvpModel> {
    return this.http
      .put(`${ENV.BASE_API}rsvp/${id}`, rsvp, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing dcomment (login required)
  editDcomment$(id: string, dcomment: DcommentModel): Observable<DcommentModel> {
    return this.http
      .put(`${ENV.BASE_API}dcomment/${id}`, dcomment, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  // PUT existing RSVP (login required)
  editRequest$(id: string, request1: RequestModel): Observable<RequestModel> {
    return this.http
      .put(`${ENV.BASE_API}rsvp/${id}`, request1, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .catch(this._handleError);
  }

  private _handleError(err: HttpErrorResponse | any) {

    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('itemName') > -1) {
      this.auth.login();
    }
    let errMsg = (err.message) ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server error';
    return Observable.throw(errorMsg);
  }

}

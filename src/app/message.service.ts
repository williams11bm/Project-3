import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Message } from './message';


@Injectable()
export class MessageService {
  private messagesUrl = 'http://localhost:3000/api/messages';

  constructor(private http: Http) { }

  getMessages() {
    return this.http
      .get(this.messagesUrl)
      .toPromise()
      .then(response => response.json() as Message[])
      .catch(this.handleError);
  }


  // Implement a method to handle errors if any
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}

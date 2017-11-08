import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ChatService {
  private url = 'https://red-square-api.herokuapp.com'; //replace with EC2 instance IP address to bind socket to deployed app server
  private socket;
  constructor() {
    this.socket = io(this.url)
  }
  public sendMessage(message) {
    this.socket.emit('new-message',
      {
        content: message.content,
        sender_id: message.sender_id,
        group_id: message.group_id
      });//sends to all sockets bound to server
  }
  public createGroup() {
    this.socket.emit('update-groups', { groupAddDelete: true });//sends to all sockets bound to server
  }
  public groupConnection(groups) {
    this.socket.emit('group-connection', { groups: groups })
  }
  public sendGroupUpdates() {
    this.socket.emit('update-groups')
  }

  // public sendNotifications(message) {
  //   this.socket.emit('send-notifications',
  //   {
  //     content: message.content,
  //
  //   })
  // }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message) //forward message to observers (users)
      })
    })
  }

  public updateGroups = () => {
    return Observable.create((observer) => {
      this.socket.on('groups', () => {
        observer.next()
      })
    })
  }

  public getNotifications = () => {
    return Observable.create((observer) => {
      this.socket.on('notifications', () => {
        observer.next()
      })
    })
  }
}

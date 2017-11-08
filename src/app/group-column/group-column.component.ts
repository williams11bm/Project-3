import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ChatService } from '../chat.service';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-group-column',
  templateUrl: './group-column.component.html',
  styleUrls: ['./group-column.component.css']
})
export class GroupColumnComponent implements OnInit {

  groups: any;
  group: any;
  member: any;
  group_id: number;
  user_id: number;
  private subscription: any;

  constructor(
    private http: Http,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    this.getGroupsOwners(options)
      // loads up a logged-in user's groups
      .subscribe(res => {
        this.groups = res;
        //console.log('groups', res)
        this.chatService.groupConnection(this.groups)
      })

    this.chatService
      .updateGroups()
      .subscribe(() => {
        this.getGroupsOwners(options)
          .subscribe(res => {
            this.groups = res;
            this.chatService.groupConnection(this.groups)
          })
      })
    this.chatService.sendGroupUpdates()

    this.route.params.subscribe(params => {
      this.group_id = +params['id']
    })

    //used for notifcations/# unread messages
    this.chatService
      .getMessages()
      .filter((message) => message.content.trim().length > 0) //filter out empty messages
      .subscribe((message) => {
        //console.log('group', this.group_id)
        //console.log('message group id', message.group_id)
        // let reset_unread = (this.group_id === message.group_id) ? true : false;
        // //console.log(reset_unread)
        // this.http.put(`https://red-square-api.herokuapp.com/api/messages/notifications/${message.group_id}`,
        //   { reset_unread: reset_unread }, options)
        //   .subscribe(res => {
        //     this.chatService.sendGroupUpdates()
        //     console.log('new message!', res.json())
        //   })
      })
  }

  resetUnreads(group_id) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    this.http.put(`https://red-square-api.herokuapp.com/api/messages/notifications/${group_id}`,
      { reset_unread: true }, options)
      .subscribe(res => {
        this.chatService.sendGroupUpdates()
        console.log(res.json())
      })
  }


  //get all groups a user belongs to
  getGroupsOwners(options): Observable<any[]> {
    return this.http.get('https://red-square-api.herokuapp.com/api/groups', options)
      .map((res: any) => res.json())
      .flatMap((groups) => {
        if (groups.groups.length > 0) {
          return Observable.forkJoin(
            groups.groups.map((group) => {
              //get owner_id from group table, then query user table for owner name
              return this.http.get('https://red-square-api.herokuapp.com/api/users/' + group.owner_id, options)
                .map((res: any) => {
                  let owner: any = res.json();
                  group.owner = owner;
                  return group;
                })
            })
          )
        }
        return Observable.of([])
      })
  }

  createGroup() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    let owner;
    //query user table to set group owner_id to current user's id
    this.http.get('https://red-square-api.herokuapp.com/api/users/user', options)
      .flatMap(user => {
        owner = user.json()
        const body = {
          name: this.group,
          owner_id: owner.id
        }

        if (this.sanitize(body.name)) {
          console.log('bad input!');
        } else {
          return this.http.post('https://red-square-api.herokuapp.com/api/groups/new', body, options)
        }
      })
      .subscribe(group => {
        //call chatService.createGroup() to call function that connects to this group in index.js
        this.chatService.createGroup();
        this.group = '';
      })
  }

  updateGroupName(id, name) {

    if (!((name.trim().length) > 0)) {
      console.log('cannot create group with empty name');
      this.chatService.sendGroupUpdates()
    }
    else {
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
      let options = new RequestOptions({ headers: headers });

      const body = {
        name: name
      }
      //console.log('name', body.name);
      this.http.put(`https://red-square-api.herokuapp.com/api/groups/${id}`, body, options)
        .subscribe(group => {
          //console.log('group', group);
          this.chatService.sendGroupUpdates()
        })
    }
  }

  deleteGroup(id) {
    //console.log('group id', id);
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });

    this.http.get('https://red-square-api.herokuapp.com/api/users/user', options)
      .flatMap(user => {
        var owner = user.json();
        //console.log('owner', owner);

        return this.http.delete(`https://red-square-api.herokuapp.com/api/groups/${id}`, options)

      })
      .subscribe(group => {
        this.chatService.sendGroupUpdates()
        //console.log(group.json().message);

        if (group.json().message === 'failed') {
          alert('Sorry, only the group creator can delete the group!');
        }
        this.router.navigateByUrl('/dashboard');
      })
  }

  sanitize(input: string) {
    var regex = /[^0-9a-zA-Z\-\_!@#$% ]+/gm;
    var found = input.match(regex);
    return found ? true : false;
  }
}

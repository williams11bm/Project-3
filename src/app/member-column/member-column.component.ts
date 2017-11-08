import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ChatService } from '../chat.service'

@Component({
  selector: 'app-member-column',
  templateUrl: './member-column.component.html',
  styleUrls: ['./member-column.component.css']
})
export class MemberColumnComponent implements OnInit {
  user_id: number;
  owner_id: number;
  group_id: number;
  member: string = "";
  isOwner: boolean;
  members: any[];
  users: string[] = [];
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.subscription = this.getMembers()
    this.getUsers()
  }

  getMembers() {
    return this.route.params.subscribe(params => {
      if (params['id']) {
        //console.log('group id', params['id'])
        this.group_id = +params['id'];
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        let options = new RequestOptions({ headers: headers })
        this.http.get('https://red-square-api.herokuapp.com/api/groups/' + this.group_id, options)
          .subscribe((group) => {
            this.owner_id = group.json().group.owner_id;
            this.members = group.json().group.users;
            this.user_id = group.json().user;
            console.log('Current Users groups and User ID', group.json())
            this.isGroupOwner()
          })
      }
    })
  }

  inviteMember() {
    let users = this.users
    if (!users.includes(this.member)) { console.log('nope nope nope') }
    else {
      let headers = new Headers();
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
      let options = new RequestOptions({ headers: headers })
      this.http.post('https://red-square-api.herokuapp.com/api/groups/add/' + this.group_id + '/' + this.member, null, options)
        .subscribe((member) => {
          this.chatService.sendGroupUpdates()
          this.subscription = this.getMembers()
          this.member = ""
        })
    }
  }

  isGroupOwner() {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    return this.http.get('https://red-square-api.herokuapp.com/api/users/user', options)
      .subscribe((user) => {
        this.isOwner = user.json().id === this.owner_id;
      })
  }

  getUsers() {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    this.http.get('https://red-square-api.herokuapp.com/api/users/protected', options)
      .subscribe(users => {
        users.json().forEach(user => {
          this.users.push(user.username)
        })
      })
  }

  setMember(user) {
    console.log('set member', user)
    this.member = user;
    this.inviteMember();
  }


  removeUser(user_id) {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    this.http.delete(`https://red-square-api.herokuapp.com/api/groups/${this.group_id}/${user_id}`, options)
      .subscribe(res => {
        console.log('removing user', res.json())
        this.getMembers()
      })
  }
}

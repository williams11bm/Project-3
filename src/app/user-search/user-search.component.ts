import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';


@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  users: any[] = [];
  userFilter: any = '';

  constructor(
    private http: Http
  ) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({headers:headers})
    this.http.get('http://localhost:3000/api/users/protected',options)
    .subscribe(users => {
      users.json().forEach(user => {
        console.log(user)
        this.users.push(user.username)
      })
      // this.users = users.json()
      console.log(users.json())
    })
  }



}

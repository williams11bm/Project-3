import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers  } from '@angular/http'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  first_name: string;
  last_name: string;
  username: string;

  constructor(
    private http: Http
  ) { }

  ngOnInit() {
    //get individual user
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    this.http.get('http://localhost:3000/api/users/user',options)
    .subscribe(res => {
      let user = res.json();
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.username = user.username
    })
  }
}

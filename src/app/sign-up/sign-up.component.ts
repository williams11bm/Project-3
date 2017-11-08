import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  invalidSignup: boolean = false;
  // user:any;


  constructor(private http: Http, private router: Router) { }

  handleSubmit(form: NgForm) {
    // console.log(form.value.user);
    this.first_name = form.value.user.first_name
    this.last_name = form.value.user.last_name
    this.username = form.value.user.username
    this.password = form.value.user.password
    const body = {
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      password: this.hashCode(this.password)
    };
    // console.log(body)

    // if (!this.sanitize(this.first_name) && !this.sanitize(this.last_name) && !this.sanitize(this.username) && !this.sanitize(this.password)) {
    //   this.http.post('http://localhost:3000/api/users/authorization', body)
    if (!this.sanitize(this.first_name) && !this.sanitize(this.last_name) && !this.sanitize(this.username) && !this.sanitize(this.password)) {
      this.http.post('https://red-square-api.herokuapp.com/api/users/authorization', body)
        .subscribe(res => {
          console.log(res.json());
          localStorage.setItem("token", res.json().token);
          this.router.navigateByUrl('/dashboard');
        }
        )
    } else {
      console.log('Invalid Sign-up')
      this.invalidSignup = true;
    }
  }

  hashCode(string: string) {
    var hash = 0;
    var char = 0;
    if (string.length == 0) {
      return hash;
    }
    for (var i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    //console.log(hash)
    return hash;
  }

  sanitize(input: string) {
    var regex = /[^0-9a-zA-Z\-\_!@#$% ]+/gm;
    var found = input.match(regex);
    return found ? true : false;
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  passwordIncorrect: boolean = false;
  userLoggedIn: boolean = false;

  constructor(private http: Http, private router: Router) { }

  handleSubmit(form: NgForm) {
    // console.log(form.value.user);

    this.username = form.value.user.username
    this.password = form.value.user.password
    const body = {
      username: this.username,
      password: this.password
    };

    if (!this.sanitize(this.username) && !this.sanitize(this.password)) {
      this.http.get(`https://red-square-api.herokuapp.com/api/users/authorized/${this.username}`)
        .subscribe(
        res => {
          if (res.json().user.password == this.hashCode(this.password)) {
            localStorage.setItem("token", res.json().token);
            this.router.navigateByUrl('/dashboard');
            this.userLoggedIn = true;
            this.passwordIncorrect = false;
          }
          else {
            console.log("incorrect password");
            this.passwordIncorrect = true;
          }
        },
        err => {
          console.log('Password Incorrect', err);
        }
        )
    }
    else {
      this.passwordIncorrect = true;

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
    var regex = /[^0-9a-zA-Z' ]+/gm;
    var found = input.match(regex);
    return found ? true : false;
  }

  ngOnInit() {
  }
}

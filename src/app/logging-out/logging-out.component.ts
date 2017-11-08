import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-logging-out',
  templateUrl: './logging-out.component.html',
  styleUrls: ['./logging-out.component.css']
})
export class LoggingOutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem("token");
    this.router.navigateByUrl('/home');
  }

}

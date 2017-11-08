import { Component, OnInit } from '@angular/core';
import { Message } from './../message';

//import { AuthService } from './auth.service';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
// import {ApiAiClient} from "api-ai-javascript";

import { Http, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';


import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/throttleTime';


@Component({
  selector: 'app-message-column',
  templateUrl: './message-column.component.html',
  styleUrls: ['./message-column.component.css']
})
export class MessageColumnComponent implements OnInit {
  messagesArray: Message[];
  group_id: any;
  owner_id: number;
  members: any[];
  message: string;
  messages: string[] = [];
  user_id: number;
  private subscription: any;
  first_name: string;
  username: string;
  dashboard: boolean = false;

  constructor(
    private chatService: ChatService,
    private http: Http,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      let headers = new Headers();
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
      let options = new RequestOptions({ headers: headers });
      this.group_id = params['id'];
      this.http.get(`https://red-square-api.herokuapp.com/api/messages/${this.group_id}`, options)
        .subscribe((messages) => {
          this.user_id = messages.json().user_id;
          this.messages = messages.json().messages;
          this.username = messages.json().username;
        })
    })

    this.chatService
      .getMessages()
      .filter((message) => message.content.trim().length > 0) //filter out empty messages
      .subscribe((message) => {
        if (this.group_id == message.group_id) {
          this.messages.push(message);
          let reset_unread = (this.group_id === message.group_id) ? true : false;
          //console.log(reset_unread)
          var headers = new Headers();
          headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
          let options = new RequestOptions({ headers: headers })
          console.log('PUTTING')
          this.http.put(`https://red-square-api.herokuapp.com/api/messages/notifications/all/${this.group_id}`,null,options)
          .subscribe(response => {
            console.log('response', response)
            this.http.put(`https://red-square-api.herokuapp.com/api/messages/notifications/${message.group_id}`,
              { reset_unread: reset_unread }, options)
              .subscribe(res => {
                this.chatService.sendGroupUpdates()
                console.log('new message!', res.json())
              })
          })
        }
      })
  }

  sendMessage() {
    var message = this.message,
      bot = "@bot";
    if (message.includes(bot)) {
      this.toBot(this.message);
    }

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
    let options = new RequestOptions({ headers: headers })
    this.http.post('https://red-square-api.herokuapp.com/api/messages/new/' + this.group_id, { message: this.message }, options)
      .subscribe((message) => {
        this.chatService.sendMessage({ content: this.username + ': ' + this.message, group_id: this.group_id, sender_id: this.user_id });
        this.message = '';
      })
  }

  toBot(query: string) {
    var botMessage = this.message.replace("@bot ", "");
    let body = JSON.stringify({ query: botMessage, lang: "en", sessionId: "runbarry" })
    let headers = new Headers();
    headers.append('Authorization', 'Bearer 6fd2e24ec46a41bea7492592b161754e');
    headers.append('Content-Type', 'application/json')

    let options = new RequestOptions({ headers: headers })
    this.http.post('https://api.api.ai/v1/query', body, options)
      .subscribe((response) => {
        //Handle Weather query
        if (response.json().result.action === "weather") {
          var city = response.json().result.parameters.address.city;
          this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=d88fb41f18210a9ff741893d6ecb34bb`)
            .subscribe((response) => {
              var thisTemp = response.json().main.temp;
              thisTemp = Math.ceil((1.8 * (thisTemp - 273) + 32));
              var weatherMessage = `The weather in ${response.json().name} right now is  ${response.json().weather[0].description} and a temperature of ${thisTemp} degrees`;
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
              let options = new RequestOptions({ headers: headers })
              this.http.post(`https://red-square-api.herokuapp.com/api/messages/new/bot/${this.group_id}`, { message: weatherMessage }, options)
                .subscribe((message) => {
                  this.chatService.sendMessage({ content: "Bot: " + weatherMessage, group_id: this.group_id, sender_id: 1 });
                  this.message = '';
                })
            })
        }
        //Handle search query
        else if (response.json().result.action === "web.search") {
          var searchQ = response.json().result.parameters.q;
          this.http.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDjTwjQAhP0JRK4ZM9tm_pSup7_eiyzPQs&cx=009089033709858816148:ll0fl04l5bg&q=${searchQ}`)
            .subscribe((response) => {
              var searchMessage = `Here is the link for the top google response ${response.json().items[0].link}`
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
              let options = new RequestOptions({ headers: headers })
              this.http.post(`https://red-square-api.herokuapp.com/api/messages/new/bot/${this.group_id}`, { message: searchMessage }, options)
                .subscribe((message) => {

                  this.chatService.sendMessage({ content: "Bot: " + searchMessage, group_id: this.group_id, sender_id: 1 });
                  this.message = '';
                })
            })
        }
        //Handle music request
        else if (response.json().result.action === "music.play") {
          var artistSearch = response.json().result.parameters.artist[0];
          this.http.get(`https://itunes.apple.com/search?term=${artistSearch}`)
            .subscribe((response) => {
              console.log(response.json())
              var artist = response.json().results[0].artistName;
              var previewUrl = response.json().results[0].previewUrl;
              var trackName = response.json().results[0].trackName;
              var musicMessage = `Artist: ${artist} Song: ${trackName} ${previewUrl}`;

              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
              let options = new RequestOptions({ headers: headers })

              this.http.post(`https://red-square-api.herokuapp.com/api/messages/new/bot/${this.group_id}`, { message: musicMessage }, options)
                .subscribe((message) => {

                  this.chatService.sendMessage({ content: "Bot: " + musicMessage, group_id: this.group_id, sender_id: 1 });
                  this.message = '';
                })
            })
        }
        //Handle chat query
        else {
          let headers = new Headers();
          headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
          let options = new RequestOptions({ headers: headers })
          this.http.post('https://red-square-api.herokuapp.com/api/messages/new/bot/' + this.group_id, { message: response.json().result.speech }, options)
            .subscribe((message) => {

              this.chatService.sendMessage({ content: "Bot: " + response.json().result.speech, group_id: this.group_id, sender_id: 1 });
              this.message = '';
            })
        }
      })
  }

  containsLink(message) {
    var link = "http";
    if (message.includes(link)) {
      return true;
    }
    else {
      return false;
    }
  }

  containsAudio(message) {
    var link = "https://audio-ssl.itunes.apple.com";
    if (message.includes(link)) {
      return true;
    }
    else {
      return false;
    }
  }

  formatLinkMessage(message) {
    var n = message.split(" ");
    return n[n.length - 1];
  }

  formatAudioMessage(message) {
    var n = message.split(" ");
    return n[n.length - 1];
  }

  formatAudioHeader(message) {

    var lastIndex = message.lastIndexOf(" ");

    message = message.substring(0, lastIndex);
    return message
  }

  notDashboard() {
    if (!this.group_id) {
      return false
    }
    return true
  }

  isSender(sender_id) {
    return this.user_id === sender_id;
  }
}

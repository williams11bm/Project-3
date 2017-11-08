import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';


import { AppComponent } from './app.component';

import { MessageService } from './message.service';
import { ChatService } from './chat.service';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupColumnComponent } from './group-column/group-column.component';
import { MessageColumnComponent } from './message-column/message-column.component';
import { MemberColumnComponent } from './member-column/member-column.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoggingOutComponent } from './logging-out/logging-out.component';
import { HomeNavComponent } from './home-nav/home-nav.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    GroupColumnComponent,
    MessageColumnComponent,
    MemberColumnComponent,
    SignUpComponent,
    HomeComponent,
    LoginComponent,
    LoggingOutComponent,
    HomeNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    Ng2FilterPipeModule
  ],
  providers: [
    MessageService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

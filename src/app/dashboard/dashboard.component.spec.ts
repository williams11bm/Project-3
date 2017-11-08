import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { GroupColumnComponent } from  '../group-column/group-column.component';
import { MessageColumnComponent } from '../message-column/message-column.component';
import { MemberColumnComponent } from '../member-column/member-column.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from '../navbar/navbar.component';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {ChatService } from '../chat.service';
import { MessageService } from '../message.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        GroupColumnComponent,
        MessageColumnComponent,
        MemberColumnComponent,
        NavbarComponent
      ],
      imports: [RouterTestingModule, FormsModule, HttpModule],
      providers: [ChatService, MessageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

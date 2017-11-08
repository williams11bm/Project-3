import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {RouterTestingModule} from "@angular/router/testing";

import { MessageColumnComponent } from './message-column.component';
import { MessageService } from '../message.service';
import { ChatService } from '../chat.service';

describe('MessageColumnComponent', () => {
  let component: MessageColumnComponent;
  let fixture: ComponentFixture<MessageColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageColumnComponent ],
      imports : [FormsModule, HttpModule, RouterTestingModule],
      providers: [ MessageService, ChatService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

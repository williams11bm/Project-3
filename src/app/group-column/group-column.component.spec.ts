import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { GroupColumnComponent } from './group-column.component';
import {ChatService } from '../chat.service';

describe('GroupColumnComponent', () => {
  let component: GroupColumnComponent;
  let fixture: ComponentFixture<GroupColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupColumnComponent ],
      imports: [ RouterTestingModule, FormsModule, HttpModule],
      providers: [ ChatService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

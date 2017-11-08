import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';

import { MemberColumnComponent } from './member-column.component';
import { ChatService } from '../chat.service';

describe('MemberColumnComponent', () => {
  let component: MemberColumnComponent;
  let fixture: ComponentFixture<MemberColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberColumnComponent ],
      imports: [ FormsModule, RouterTestingModule, HttpModule],
      providers: [ ChatService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

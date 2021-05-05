import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SinodPage } from './sinod.page';

describe('SinodPage', () => {
  let component: SinodPage;
  let fixture: ComponentFixture<SinodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SinodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

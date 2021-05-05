import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlovarPage } from './slovar.page';

describe('SlovarPage', () => {
  let component: SlovarPage;
  let fixture: ComponentFixture<SlovarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlovarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlovarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

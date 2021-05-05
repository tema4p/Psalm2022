import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NeedsPage } from './needs.page';

describe('NeedsPage', () => {
  let component: NeedsPage;
  let fixture: ComponentFixture<NeedsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NeedsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageViewPage } from './page-view.page';

describe('PageViewPage', () => {
  let component: PageViewPage;
  let fixture: ComponentFixture<PageViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

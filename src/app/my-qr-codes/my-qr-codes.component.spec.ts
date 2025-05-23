import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQrCodesComponent } from './my-qr-codes.component';

describe('MyQrCodesComponent', () => {
  let component: MyQrCodesComponent;
  let fixture: ComponentFixture<MyQrCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyQrCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQrCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

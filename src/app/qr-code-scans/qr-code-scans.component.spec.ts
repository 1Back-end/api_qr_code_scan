import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeScansComponent } from './qr-code-scans.component';

describe('QrCodeScansComponent', () => {
  let component: QrCodeScansComponent;
  let fixture: ComponentFixture<QrCodeScansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodeScansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrCodeScansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

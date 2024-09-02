import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestPassPage } from './rest-pass.page';

describe('RestPassPage', () => {
  let component: RestPassPage;
  let fixture: ComponentFixture<RestPassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RestPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

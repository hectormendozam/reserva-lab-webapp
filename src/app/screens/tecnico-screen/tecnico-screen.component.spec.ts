import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicoScreenComponent } from './tecnico-screen.component';

describe('TecnicoScreenComponent', () => {
  let component: TecnicoScreenComponent;
  let fixture: ComponentFixture<TecnicoScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TecnicoScreenComponent]
    });
    fixture = TestBed.createComponent(TecnicoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarLabComponent } from './eliminar-lab.component';

describe('EliminarLabComponent', () => {
  let component: EliminarLabComponent;
  let fixture: ComponentFixture<EliminarLabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarLabComponent]
    });
    fixture = TestBed.createComponent(EliminarLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

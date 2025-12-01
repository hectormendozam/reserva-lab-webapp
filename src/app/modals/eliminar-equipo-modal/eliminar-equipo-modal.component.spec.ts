import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEquipoModalComponent } from './eliminar-equipo-modal.component';

describe('EliminarEquipoModalComponent', () => {
  let component: EliminarEquipoModalComponent;
  let fixture: ComponentFixture<EliminarEquipoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarEquipoModalComponent]
    });
    fixture = TestBed.createComponent(EliminarEquipoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment, EquipmentStatus } from '../../shared/models';
import { EquipmentService } from '../../services/equipment.service';
import { EliminarEquipoModalComponent } from 'src/app/modals/eliminar-equipo-modal/eliminar-equipo-modal.component';

@Component({
  selector: 'app-equipment-list-screen',
  templateUrl: './equipment-list-screen.component.html',
  styleUrls: ['./equipment-list-screen.component.scss']
})
export class EquipmentListScreenComponent implements OnInit {
  equipos: Equipment[] = [];
  dataSource = new MatTableDataSource<Equipment>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'nombre', 'descripcion', 'numeroInventario', 'cantidadTotal', 'cantidadDisponible', 'status', 'acciones'];
  filtro: string = '';
  ordenPor: string = 'nombre';

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 100);
  }

  cargarEquipos(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de equipos...');
    this.equipmentService.list().subscribe({
      next: (data) => {
        console.log('Equipos recibidos del backend:', data);
        this.equipos = data;
        this.actualizarDataSource();
        this.cargando = false;
        if (data.length === 0) {
          console.warn('La lista de equipos está vacía');
        }
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        if (err.error) {
          console.error('Error body:', err.error);
        }
        this.error = `No se pudieron cargar los equipos. ${err.status ? `(Error ${err.status})` : ''}`;
        this.cargando = false;
      },
    });
  }

  actualizarDataSource(): void {
    let datos = [...this.equipos];
    // Aplicar filtro
    if (this.filtro.trim()) {
      const busqueda = this.filtro.toLowerCase();
      datos = datos.filter(eq =>
        eq.nombre?.toLowerCase().includes(busqueda) ||
        eq.descripcion?.toLowerCase().includes(busqueda) ||
        eq.numeroInventario?.toLowerCase().includes(busqueda)
      );
    }
    // Aplicar orden
    datos.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (this.ordenPor) {
        case 'nombre':
          aVal = a.nombre;
          bVal = b.nombre;
          break;
        case 'disponible':
          aVal = a.cantidadDisponible;
          bVal = b.cantidadDisponible;
          break;
        case 'total':
          aVal = a.cantidadTotal;
          bVal = b.cantidadTotal;
          break;
        default:
          aVal = a.nombre;
          bVal = b.nombre;
      }
      return typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
    });
    this.dataSource.data = datos;
  }

  aplicarFiltro(event: any): void {
    this.filtro = event.target.value;
    this.actualizarDataSource();
  }

  cambiarOrden(campo: string): void {
    this.ordenPor = campo;
    this.actualizarDataSource();
  }

  irNuevoEquipo(): void {
    this.router.navigate(['/equipos/nuevo']);
  }

  traducirEstado(estado: EquipmentStatus): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'MANTENIMIENTO':
        return 'Mantenimiento';
      default:
        return estado;
    }
  }

  public abrirEditar(eq: Equipment){
    let userStr = localStorage.getItem('user');
    let role = '';
    try{ if(userStr) role = JSON.parse(userStr).role || ''; }catch(e){ role = ''; }
    const isAdmin = ['ADMIN','administrador','TECNICO','TECHNICIAN'].includes(role) || role.toLowerCase?.() === 'administrador';

    this.router.navigate(['/equipos/nuevo'], { state: { equipment: eq, readonly: !isAdmin } });
  }

  public abrirEliminar(eq: Equipment){
    let userStr = localStorage.getItem('user');
    let role = '';
    try{ if(userStr) role = JSON.parse(userStr).role || ''; }catch(e){ role = ''; }

    const dialogRef = this.dialog.open(EliminarEquipoModalComponent,{
      data: { id: eq.id, rol: role },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.isDelete){
        this.cargarEquipos();
      }
    });
  }
}

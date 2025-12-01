import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReservationsService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-cancelar-reserva-modal',
  templateUrl: './cancelar-reserva-modal.component.html',
  styleUrls: ['./cancelar-reserva-modal.component.scss']
})
export class CancelarReservaModalComponent implements OnInit {
  formulario!: FormGroup;
  cancelando = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private reservationsService: ReservationsService,
    private dialogRef: MatDialogRef<CancelarReservaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      motivo: ['', [Validators.maxLength(500)]]
    });
  }

  public cancelarReserva(): void {
    this.cancelando = true;
    this.error = undefined;

    const motivo = this.formulario.get('motivo')?.value || '';
    const reservaId = this.data?.id;

    if (!reservaId) {
      this.cancelando = false;
      this.error = 'ID de reserva no válido.';
      return;
    }

    this.reservationsService.cancel(reservaId, motivo).subscribe({
      next: (response) => {
        console.log('Reserva cancelada:', response);
        this.cancelando = false;
        this.dialogRef.close({ isCanceled: true });
      },
      error: (err) => {
        console.error('Error al cancelar reserva:', err);
        this.cancelando = false;
        this.error = 'No se pudo cancelar la reserva. Intenta más tarde.';
      }
    });
  }

  public cerrar(): void {
    this.dialogRef.close({ isCanceled: false });
  }
}

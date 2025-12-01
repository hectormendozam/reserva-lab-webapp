import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida que la contraseña tenga:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const isLengthValid = password.length >= 8;

    if (!isLengthValid) {
      return { passwordLength: { requiredLength: 8, actualLength: password.length } };
    }

    if (!hasUpperCase) {
      return { passwordUpperCase: true };
    }

    if (!hasLowerCase) {
      return { passwordLowerCase: true };
    }

    if (!hasNumeric) {
      return { passwordNumeric: true };
    }

    return null;
  };
}

/**
 * Valida que la fecha sea posterior a hoy (no permite fechas pasadas)
 */
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { pastDate: true } : null;
  };
}

/**
 * Valida que horaInicio < horaFin en un FormGroup
 * Se debe aplicar al FormGroup, no al control individual
 */
export function horasCoherentesValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const horaInicio = group.get('horaInicio')?.value;
    const horaFin = group.get('horaFin')?.value;
    if (!horaInicio || !horaFin) return null;
    return horaInicio >= horaFin ? { horasIncoherentes: true } : null;
  };
}

/**
 * Valida que fechaDevolucion >= fechaPrestamo en un FormGroup
 */
export function fechasCoherentesValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fechaPrestamo = group.get('fechaPrestamo')?.value;
    const fechaDevolucion = group.get('fechaDevolucion')?.value;
    if (!fechaPrestamo || !fechaDevolucion) return null;
    
    const inicio = new Date(fechaPrestamo);
    const fin = new Date(fechaDevolucion);
    return fin < inicio ? { fechasIncoherentes: true } : null;
  };
}

/**
 * Valida que la cantidad solicitada no exceda la disponible
 * Este validador debe aplicarse dinámicamente cuando cambia el equipo
 */
export function cantidadDisponibleValidator(cantidadDisponible: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cantidad = Number(control.value);
    return cantidad > cantidadDisponible ? { cantidadExcedida: { max: cantidadDisponible, actual: cantidad } } : null;
  };
}

/**
 * Validador que puede reutilizarse para validar nombres únicos (requiere backend)
 * Por ahora retorna null, la validación debe ocurrir en el backend
 */
export function unicoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // La validación de unicidad debe ocurrir en el backend
    // Este es un placeholder para futura implementación con async validators
    return null;
  };
}

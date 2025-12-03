import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { pastDate: true } : null;
  };
}

export function horasCoherentesValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const horaInicio = group.get('horaInicio')?.value;
    const horaFin = group.get('horaFin')?.value;
    if (!horaInicio || !horaFin) return null;
    return horaInicio >= horaFin ? { horasIncoherentes: true } : null;
  };
}

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

export function cantidadDisponibleValidator(cantidadDisponible: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cantidad = Number(control.value);
    return cantidad > cantidadDisponible ? { cantidadExcedida: { max: cantidadDisponible, actual: cantidad } } : null;
  };
}

export function unicoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  };
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function containsNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    const containsNumber = /\d/.test(value);

    return containsNumber
      ? null
      : {
          containsNumber: true,
        };
  };
}

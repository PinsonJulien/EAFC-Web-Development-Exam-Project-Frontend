import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Ensures two form controls have the same value.
export function matchValidator(controlToMatch: AbstractControl<any>): ValidatorFn {
  return (control: AbstractControl<any>) : ValidationErrors | null => {
    return controlToMatch.value !== control.value
      ? { match: true }
      : null;
  }
}

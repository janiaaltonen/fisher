import { FormGroup } from '@angular/forms';

export class CustomValidators {

  public static MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors( { mustMatch: true });
      } else {
        matchingControl.setErrors({ mustMatch: false });
      }
    };
  }

  public static CanNotMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.canNotMatch) {
        return;
      }
      if (control.value === matchingControl.value) {
        matchingControl.setErrors( { canNotMatch: true });
      } else {
        matchingControl.setErrors({ canNotMatch: false });
      }
    };
  }

}

import {AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { AuthenticationService } from '@app/_services';
import {Observable, timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

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
        matchingControl.setErrors(null);
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
        matchingControl.setErrors(null);
      }
    };
  }

  public static UsernameAsyncValidator(authService: AuthenticationService, time: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return timer(time).pipe(
        switchMap(() => authService.checkUsername(control.value)),
        map(res => {
          console.log(res);
          return res.available ? null : {userExists: true };
        })
      );
    };
  }
}

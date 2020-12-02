import {AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { AuthenticationService } from '@app/_services';
import {Observable, timer} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

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
      const formData: any = new FormData();
      formData.append('username', control.value);
      return timer(time).pipe(
        switchMap(() => authService.checkUsername(formData)),
        map(res => {
          return res.available ? null : { userExists: true };
        })
      );
    };
  }

  public static EmailAsyncValidator(authService: AuthenticationService, time: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      const formData = new FormData();
      formData.append('email', control.value);
      return timer(time).pipe(
        switchMap(() => authService.checkEmail(formData)),
        map( res => {
          console.log(res);
          return res.available ? null : { emailExists: true };
        }),
      );
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../_services';
import { CustomValidators } from '@app/_helpers';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  pswInfoText = 'Salasanan tulee olla vähintään 8 merkkiä pitkä. Salasana ei voi olla sama tai liian samanlainen kuin käyttäjätunnus.';
  loginForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // pattern for email '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required, CustomValidators.UsernameAsyncValidator(this.authService, 1000)],
      password1: ['', [
        Validators.required,
        Validators.minLength(8)]],
      password2: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    }, {
      validators: [CustomValidators.MustMatch('password1', 'password2'),
        CustomValidators.CanNotMatch('username', 'password1')]
    });
  }

  get controls() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    // implement check for password, validators etc.
    // include email also when support ready in backend
    const formData: any = new FormData();
    formData.append('username', this.controls.username.value);
    formData.append('email', this.controls.email.value);
    formData.append('password1', this.controls.password1.value);
    formData.append('password2', this.controls.password2.value);
    this.authService.signUp(formData).pipe().subscribe(
      data => {
          this.router.navigate(['/events']);
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this.handle422ServerErrors(err.error);
            this.loading = false;
            return;
          }
        }
      }
    );
  }

  handle422ServerErrors(errorObj): void {
    Object.keys(errorObj).forEach(key => {
      // console.log(error[key]);
      // parse error message strings from server side JSON to array
      const errMsgArr = errorObj[key].map(msg => {
        return msg.message;
      });
      const formControl = this.loginForm.get(key);
      if (formControl) {
        formControl.setErrors({
          serverError: errMsgArr
        });
      }
    });
  }

}

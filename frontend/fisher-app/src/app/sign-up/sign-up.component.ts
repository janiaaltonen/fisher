import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../_services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  pswInfoText = 'Salasanan tulee olla vähintään 8 merkkiä pitkä. Salasana ei voi olla sama kuin käyttäjätunnus.';
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password1: ['', ],
      password2: ['', ],
      email: ['', ]
    });
  }

  get controls() { return this.loginForm.controls; }

  onSubmit(): void {
    // implement check for password, validators etc.
    // include email also when support ready in backend
    const formData: any = new FormData();
    formData.append('username', this.controls.username.value);
    formData.append('password1', this.controls.password1.value);
    formData.append('password2', this.controls.password2.value);
    this.authService.signUp(formData).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

}

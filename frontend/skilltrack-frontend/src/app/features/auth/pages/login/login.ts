import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { containsNumberValidator } from '../../../../shared/validators/password.validator';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // email = new FormControl('');

  private readonly formBuilder = inject(FormBuilder);

  // loginForm = new FormGroup({
  //   email: new FormControl('', {
  //     nonNullable: true,
  //     validators: [Validators.required, Validators.email],
  //   }),
  //   password: new FormControl('', {
  //     nonNullable: true,
  //     validators: [Validators.required, Validators.minLength(8)],
  //   }),
  // });

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],

    // password: ['', [Validators.required, Validators.minLength(8), containsNumberValidator()]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();

    console.log('Login credentials:', credentials);
  }
}

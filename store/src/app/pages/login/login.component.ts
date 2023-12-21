import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage: string = '';
  submitted: boolean = false;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), this.noSpacesValidator]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home']);
    }
  }

  noSpacesValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && /\s/.test(control.value)) {
      return { 'noSpaces': true };
    }
    return null;
  }

  login() {
    this.submitted = true;

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/home']);
        },
        error: (response) => {
          this.errorMessage = response.error.error;
        }
      });
    } else {
      this.errorMessage = 'Заполните поля';
    }
  }
}
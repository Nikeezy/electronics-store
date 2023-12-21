import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errorMessage: string = '';
  registrationForm: FormGroup;
  submitted: boolean = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
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

  register() {
    this.submitted = true;

    if (this.registrationForm.valid) {
      const email = this.registrationForm.get('email')?.value;
      const password = this.registrationForm.get('password')?.value;

      this.authService.register(email, password).subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/login']);
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
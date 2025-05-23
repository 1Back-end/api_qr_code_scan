import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component ,ChangeDetectorRef, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  showPassword: boolean = false;
  currentYear: number = new Date().getFullYear();  // Initialisation directe
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  togglePasswordVisibility(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.showPassword = isChecked;
  }
  ngOnInit(): void {

  }
  

  Login() {
  if (this.LoginForm.invalid || this.isLoading) return;

  this.isLoading = true;

  const { email, password } = this.LoginForm.value;

  this.authService.login(email, password).subscribe({
    next: (response) => {
      const user = response.user;
      localStorage.setItem('user', btoa(JSON.stringify(user)));

      if (user.is_new_user) {
        this.toastr.success('Veuillez changer votre mot de passe');
        this.router.navigateByUrl('/auth/change-password');
      } else {
        this.router.navigateByUrl('/admin/dashboard');
      }
      
      this.isLoading = false;
    },
    error: (error) => {
      const message = error?.error?.detail;
      this.toastr.error(message);
      this.isLoading = false;
    }
  });
}

  
  
}


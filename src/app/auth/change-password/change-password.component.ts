import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CONFIG } from '../../../../config'

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Initialisation du formulaire avec validation
    this.changePasswordForm = this.fb.group({
      email: ['', Validators.required],
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid || this.isLoading) return;
  
    this.isLoading = true;
  
    const formData = this.changePasswordForm.value;
  
    // Récupération du token depuis le localStorage
    const storedToken = localStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken)?.access_token : null;
  
    if (!token) {
      this.toastr.error('Vous devez être connecté pour modifier votre mot de passe');
      this.isLoading = false; // <- important de remettre à false ici
      return;
    }
  
    // Appel à l'API backend pour changer le mot de passe
    this.http.put(`${CONFIG.apiUrl}/authentification/change-password`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (response: any) => {
        this.toastr.success(response?.message || 'Mot de passe modifié avec succès');
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (error) => {
        const message = error?.error?.detail || 'Erreur lors du changement de mot de passe';
        this.toastr.error(message);
        this.isLoading = false;
      }
    });
  }
  
}

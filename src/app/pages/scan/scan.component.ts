import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../../config';
import { FormsModule } from '@angular/forms'; 
import {RoleService } from '../../services/role.service';
import { ActivatedRoute } from '@angular/router'; // 👈 import
@Component({
  selector: 'app-scan',
   imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {

   data: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  searchQuery: string = '';
  exportUrl: string = '';
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne
  CONFIG = CONFIG;
  selectedQrCode: any;
  ServiceForm: FormGroup; 
  current_uuid: string | null = null;

  currentYear: number = new Date().getFullYear();


  constructor(private toastr: ToastrService, private fb: FormBuilder,public role: RoleService, private http: HttpClient,private route: ActivatedRoute) {
    this.ServiceForm = this.fb.group({
      qr_code_uuid: ['', Validators.required],
      email : ['',Validators.required],
      social_link: ['', Validators.required],
      custom_social_link: ['',Validators.required]  // Optionnel, validé dynamiquement

    });

  }

ngOnInit(): void {
  this.current_uuid = this.route.snapshot.paramMap.get('uuid');

  if (this.current_uuid) {
    this.ServiceForm.patchValue({ qr_code_uuid: this.current_uuid });

    // Appelle le endpoint status pour savoir si déjà utilisé
    this.http.get<{ is_used: boolean }>(`${CONFIG.apiUrl}/qr_codes/status/${this.current_uuid}`)
      .subscribe({
        next: (res) => {
          if (res.is_used) {
            // Si activé, ouvre la redirection via le endpoint qui redirige
            this.handleQrClick({ uuid: this.current_uuid });
          }
        },
        error: (error:any) => {
          this.toastr.error(error?.error?.detail);
        }
      });
  }
}


onSubmit(): void {
  if (this.ServiceForm.invalid || this.isLoading) return;

  this.isLoading = true;
  const formData = this.ServiceForm.value;

  this.http.post(`${CONFIG.apiUrl}/qr_codes/activate-qr-code`, formData).subscribe({
    next: (response: any) => {
      this.toastr.success(response?.message || 'QR code activé avec succès.');
      this.isLoading = false;
      this.ServiceForm.reset();
      this.handleQrClick({ uuid: this.current_uuid }); // ✅ Redirection immédiate
    },
    error: (error) => {
      this.toastr.error(error?.error?.detail || 'Une erreur est survenue.');
      this.isLoading = false;
    },
  });
}

handleQrClick(qr_code: any): void {
  window.open(`${CONFIG.apiUrl}/qr_codes/qrcode/${this.current_uuid}`, '_blank');
}


}

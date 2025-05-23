import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms'; 
import {RoleService } from '../services/role.service';
@Component({
  selector: 'app-my-qr-codes',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './my-qr-codes.component.html',
  styleUrl: './my-qr-codes.component.css'
})
export class MyQrCodesComponent {

  
  data: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 10;
  searchQuery: string = '';
  exportUrl: string = '';
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne
  CONFIG = CONFIG;
  selectedQrCode: any;
  current_uuid: string | null = null;
  ServiceForm: FormGroup; 
  deleteQrCodeUuid: string | null = null;



  constructor(private toastr: ToastrService, private fb: FormBuilder,public role: RoleService, private http: HttpClient) {
    this.ServiceForm = this.fb.group({
      qr_code_uuid: ['', Validators.required],
      social_link: [''],
      custom_social_link: ['']  // Optionnel, validé dynamiquement
    });
  }

  ngOnInit(): void {
  this.getscanqrcodes(); // Charger les utilisateurs au démarrage
}

openQrModal(qrCodeUuid: string): void {
  this.isLoading = true;
  this.http.get<any>(`${CONFIG.apiUrl}/qr_codes/get-qr-code?uuid=${qrCodeUuid}`)
    .subscribe({
      next: (data) => {
        this.ServiceForm.patchValue({
          qr_code_uuid: data.qr_code.uuid || '',
          social_link: data.customer?.social_link || '',
          custom_social_link: data.customer?.custom_social_link || ''
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        const message = error?.error?.detail ?? 'Une erreur est survenue';
        this.toastr.error(message);
        this.isLoading = false;
      }
    });
}


getscanqrcodes(): void {
  this.isLoading = true;
  const params = new HttpParams()
    .set('page', this.currentPage.toString())
    .set('per_page', this.titlesPerPage.toString());

  this.http.get<any>(`${CONFIG.apiUrl}/qr_codes/get-my-qr_code`, { params }).subscribe(
    (response) => {
      this.data = response.data;
      this.currentPage = response.current_page;
      this.totalPages = response.pages; // ✅ Correspond à "pages" dans ta réponse
      this.totalItems = response.total;
      this.isLoading = false;
      console.log(response.data)
    },
    (error) => {
      this.toastr.error('Erreur lors du chargement des données');
      this.isLoading = false;
    }
  );
}

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getscanqrcodes();
  }

  updateStatus(qrCodeUuid: string, status: string): void {
  this.isLoading = true;
  const url = `${CONFIG.apiUrl}/qr_codes/disable-my-qr-codes`;

  const requestData = {
    qr_uuid: qrCodeUuid, // Ce champ utilise désormais qr_code.qr_code.uuid
    status: status
  };

  this.http.put<any>(url, requestData).subscribe(
    (response) => {
      this.toastr.success(response?.message || 'Statut mis à jour avec succès');
      this.getscanqrcodes();  // Rafraîchir la liste
      this.isLoading = false;
    },
    (error) => {
      const errorMessage = error?.error?.detail || 'Erreur lors de la mise à jour du statut';
      this.toastr.error(errorMessage);
      this.isLoading = false;
    }
  );
}

onSubmit(): void {
  if (this.ServiceForm.invalid || this.isLoading) return;
  this.isLoading = true;
  const formData = this.ServiceForm.value;
  this.http.put(`${CONFIG.apiUrl}/qr_codes/update-social-links`, formData).subscribe({
    next: (response: any) => {
      const message = response?.message || 'QR code activé avec succès.';
      this.toastr.success(message);
      this.getscanqrcodes();
      this.isLoading = false; // ✅ désactive le loader
      this.ServiceForm.reset();
    },
    error: (error) => {
      const message = error?.error?.detail || 'Une erreur est survenue.';
      this.toastr.error(message);
      this.isLoading = false; // ✅ désactive le loader
    },
    
  });
}

prepareDelete(uuid: string): void {
  this.deleteQrCodeUuid = uuid;
}


}

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
  selector: 'app-qr-codes',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './qr-codes.component.html',
  styleUrl: './qr-codes.component.css'
})
export class QrCodesComponent {
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
  serviceToDelete: any = null;



  constructor(private toastr: ToastrService, private fb: FormBuilder,public role: RoleService, private http: HttpClient) {
  }

  ngOnInit(): void {
  this.getqrcodes(); // Charger les utilisateurs au démarrage
}




getqrcodes(): void {
  this.isLoading = true;
  const params = new HttpParams()
    .set('page', this.currentPage.toString())
    .set('per_page', this.titlesPerPage.toString());

  this.http.get<any>(`${CONFIG.apiUrl}/qr_codes/get_many`, { params }).subscribe(
    (response) => {
      this.data = response.data;
      this.currentPage = response.current_page;
      this.totalPages = response.pages; // ✅ Correspond à "pages" dans ta réponse
      this.totalItems = response.total;
      this.isLoading = false;
      // console.log(response.data)
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
    this.getqrcodes();
  }


generateQRCode() {
  this.isLoading = true; // ✅ active le loader
  this.http.post<any>(`${CONFIG.apiUrl}/qr_codes/generate-qrcode`, {}).subscribe({
    next: (response) => {
      this.toastr.success(response?.message ?? 'QR code généré avec succès');
      this.getqrcodes(); // recharge la liste
      this.isLoading = false; // ✅ désactive le loader
    },
    error: (error) => {
      const message = error?.error?.detail ?? 'Une erreur est survenue';
      this.toastr.error(message);
      this.isLoading = false; // ✅ désactive le loader
    }
  });
}
openDeleteModal(qr_uuid: string): void {
  this.serviceToDelete = qr_uuid;
}

deleteQrCode(): void {
  if (!this.serviceToDelete || this.isLoading) return;

  this.isLoading = true;
  this.http.put(`${CONFIG.apiUrl}/qr_codes/delete-qr-code`, {
    uuid: this.serviceToDelete
  }).subscribe({
    next: (response: any) => {
      const message = response?.message || 'QR code supprimé avec succès.';
      this.toastr.success(message);
      this.isLoading = false;
      this.getqrcodes(); // Recharge la liste
    },
    error: (error: any) => {
      const message = error?.error?.detail || 'Une erreur est survenue lors de la suppression.';
      this.toastr.error(message);
      this.isLoading = false;
    }
  });
}

downloadQrCode(imagePath: string): void {
  this.isLoading = true;
  this.toastr.info('Téléchargement en cours...', '', { timeOut: 2000 });

  const url = `${this.CONFIG.baseUrl}/media/${imagePath}`;

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imagePath.split('/').pop() || 'qr_code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      this.toastr.error('Erreur lors du téléchargement');
    })
    .finally(() => {
      this.isLoading = false;
      this.toastr.success('Téléchargement terminé !');
    });
}

}


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
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

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


  constructor(private toastr: ToastrService, private fb: FormBuilder,public role: RoleService, private http: HttpClient) {
    this.ServiceForm = this.fb.group({
      qr_code_uuid: ['', Validators.required],
      email : ['',Validators.required,Validators.email],
      social_link: ['', Validators.required],
      custom_social_link: ['',Validators.required]  // Optionnel, validé dynamiquement

    });

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
       this.data = this.data.concat(response.data); // ⬅️ Ajouter au lieu d'écraser
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
loadMore(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.getqrcodes();
  }
}

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getqrcodes();
  }



openQrModal(qr_code: any): void {
  console.log(qr_code)
  // Pas besoin de stocker dans this.current_uuid
  this.http.get<any>(`${CONFIG.apiUrl}/qr_codes/get_by_uuid?uuid=${qr_code.uuid}`)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.ServiceForm.patchValue({
          qr_code_uuid: data.uuid || '' // Assure que le bon UUID est chargé dans le formulaire
        });
      },
      error: (error: any) => {
        const message = error?.error?.detail ?? 'Une erreur est survenue';
        this.toastr.error(message);
        this.isLoading = false;
      }
    });
}


handleQrClick(qr_code: any): void {
 window.open(`${CONFIG.apiUrl}/qr_codes/qrcode/${qr_code.uuid}`, '_blank');

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

onSubmit(): void {
  if (this.ServiceForm.invalid || this.isLoading) return;

  this.isLoading = true;
  const formData = this.ServiceForm.value;

  this.http.post(`${CONFIG.apiUrl}/qr_codes/activate-qr-code`, formData).subscribe({
    next: (response: any) => {
      const message = response?.message || 'QR code activé avec succès.';
      this.toastr.success(message);
      this.getqrcodes();
      this.isLoading = false; // ✅ désactive le loader
      this.ServiceForm.reset();
      // Fermer modale si nécessaire ici
    },
    error: (error) => {
      const message = error?.error?.detail || 'Une erreur est survenue.';
      this.toastr.error(message);
      this.isLoading = false; // ✅ désactive le loader
    },
    
  });
}



}

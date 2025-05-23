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
  selector: 'app-qr-code-scans',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './qr-code-scans.component.html',
  styleUrl: './qr-code-scans.component.css'
})
export class QrCodeScansComponent {

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



  constructor(private toastr: ToastrService, private fb: FormBuilder,public role: RoleService, private http: HttpClient) {
  }

  ngOnInit(): void {
  this.getscanqrcodes(); // Charger les utilisateurs au démarrage
}




getscanqrcodes(): void {
  this.isLoading = true;
  const params = new HttpParams()
    .set('page', this.currentPage.toString())
    .set('per_page', this.titlesPerPage.toString());

  this.http.get<any>(`${CONFIG.apiUrl}/qr_codes/get-many-qr-code-scan`, { params }).subscribe(
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
    this.getscanqrcodes();
  }


}

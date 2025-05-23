import { Component, OnInit } from '@angular/core';
import { RouterLink, Router,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularPhoneNumberInput } from 'angular-phone-number-input';
@Component({
  standalone: true,
  selector: 'app-add-utilisateurs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularPhoneNumberInput,
    RouterLink
  ],
  templateUrl: './add-utilisateurs.component.html',
  styleUrl: './add-utilisateurs.component.css'
})
export class AddUtilisateursComponent implements OnInit {
  UserForm: FormGroup;
  filePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;

 

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.UserForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],  // Validation pour le numéro de téléphone
      role: ['', Validators.required],
      login: ['', Validators.required],
      avatar_uuid : [null]
    });
  }
  onInputChange(event: any): void {
    console.log(event); // Debug to check event data
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
  
      // Générer un aperçu de l’image
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  removeFile() {
    this.selectedFile = null;
    this.filePreview = null;
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.UserForm.invalid || this.isLoading) return;
    this.isLoading = true; // Active le loading
  
    const formData = { ...this.UserForm.value, avatar_uuid: null };

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
  
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
  
      console.log("Uploading image...");
  
      this.http.post<any>(`${CONFIG.apiUrl}/storages/upload`, uploadForm).subscribe({
        next: (uploadResponse) => {
          const avatar_uuid = uploadResponse?.uuid; // 👈 correction ici
          if (avatar_uuid) {
            formData.avatar_uuid = avatar_uuid;
            this.toastr.success("Image téléchargée avec succès.");
          } else {
            this.toastr.warning("UUID manquant. Enregistrement sans image.");
          }
          this.createUsers(formData);
          
        },
        error: (err) => {
          console.error("Erreur upload image:", err);
          this.toastr.error("Erreur lors du téléchargement de l'image.");
          // Tu peux commenter la ligne suivante si tu veux stopper tout si l’image échoue
          this.createUsers(formData);
        }
      });
    } else {
      // Pas d'image : envoyer directement
      this.createUsers(formData);
    }
  }
  
  createUsers(data: any): void {
    this.http.post<any>(`${CONFIG.apiUrl}/users/register`, data).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/users']);
        this.toastr.success(response.message);
        this.UserForm.reset();
        this.isLoading = false; // ✅ loading désactivé
      },
      error: (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
        this.isLoading = false; // ✅ loading désactivé
      }
    });
  }
}

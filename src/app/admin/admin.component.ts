import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Router,RouterLink ,RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../../config'
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule,RouterLink, MenuComponent, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isAuthenticated: boolean = false;
  centres: any[] = [];
  selectedCentre: string = '';
  userFullName: string = '';
  userInfo: { email: string, avatarUrl: string } = { email: '', avatarUrl: '/logo.jpg' };

  @ViewChild('closeBtnOffCanvas') closeBtnOffCanvas!: ElementRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    // Vérifie si l'utilisateur est authentifié
    this.isAuthenticated = !!this.authService.getToken();
    
    this.userInfo = this.authService.getUserInfo();
  }
  


  logout(): void {
    this.authService.logout(); // Appel à la méthode de déconnexion
    this.router.navigate(['/login']); // Rediriger vers la page de login après déconnexion
  }

  // Fonction pour changer la langue
  
  // Fonction pour fermer l'OffCanvas (menu latéral)
  closeOffCanvas(): void {
    if (this.closeBtnOffCanvas?.nativeElement) {
      this.closeBtnOffCanvas.nativeElement.click();
    }
  }
}

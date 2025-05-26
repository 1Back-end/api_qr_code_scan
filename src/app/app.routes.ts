import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LoginGuard } from './auth/login.guard'; // Importation du guard de connexion
import { AuthGuard } from './auth/auth.guard'; // Importation du guard d'authentification
import { AdminComponent } from './admin/admin.component'; // Composant principal pour l'admin
import { DashboardComponent } from './dashboard/dashboard.component'; // Composant de dashboard
import {UtilisateursComponent} from './utilisateurs/utilisateurs.component'; // Composant pour les utilisateurs
import {AddUtilisateursComponent} from './utilisateurs/add-utilisateurs/add-utilisateurs.component'; // Composant pour ajouter des utilisateurs
import {EditUtilisateursComponent} from './utilisateurs/edit-utilisateurs/edit-utilisateurs.component'
import {ChangePasswordComponent} from './auth/change-password/change-password.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {CodeOtpComponent} from './auth/code-otp/code-otp.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {QrCodesComponent} from './qr-codes/qr-codes.component';
import {HomeComponent} from './pages/home/home.component';

import {MyQrCodesComponent} from './my-qr-codes/my-qr-codes.component'
import {QrCodeScansComponent} from './qr-code-scans/qr-code-scans.component';
import {ProfileComponent} from './profile/profile.component';
import {ScanComponent} from './pages/scan/scan.component';


export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [LoginGuard] 
  },
  
  
  // Route de l'admin (avec sous-routes)
  {
    path: 'admin', 
    component: AdminComponent, // Composant principal pour l'admin
    canActivate: [AuthGuard], // Protège cette route avec un guard d'authentification
    children: [
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
        { path: 'users', component: UtilisateursComponent, canActivate: [AuthGuard] },
        { path: 'users/add', component: AddUtilisateursComponent, canActivate: [AuthGuard] },
        { path: 'users/edit/:uuid', component: EditUtilisateursComponent, canActivate: [AuthGuard] },
        { path: 'qr_codes',component:QrCodesComponent,canActivate: [AuthGuard]},
        { path: 'my_qr_codes',component:MyQrCodesComponent,canActivate:[AuthGuard]},
        { path: 'qr_codes_scan',component:QrCodeScansComponent,canActivate:[AuthGuard]},
        { path: 'profile',component:ProfileComponent,canActivate:[AuthGuard]},
        { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }
      ]
    },
  // 👇 Home devient la route par défaut
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'auth/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/code-otp', component: CodeOtpComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
  { path: 'scan/:uuid', component: ScanComponent },
  
];

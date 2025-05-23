import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() closeOffCanvas = new EventEmitter<boolean>();

  constructor(private router: Router, public role: RoleService) {}

  menuRoutes: any = [
    {
      id: 'dashboard',
      path: '/admin/dashboard',
      label: 'Tableau de bord',
      icon: 'fa-solid fa-chart-simple', // Icône de tableau de bord
      visibleFor: ['ADMIN','SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },
    {
      id: 'qr_codes',
      path: '/admin/qr_codes',
      label: 'Génération des QR codes',
      icon: 'fa-solid fa-qrcode', // Icône pour envoi
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },

    {
      id: 'qr_codes_scan',
      path: '/admin/qr_codes_scan',
      label: 'Gestion des QR codes scannés',
      icon: 'fa-solid fa-fingerprint', // Icône pour envoi
      visibleFor: ['SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },

    {
      id: 'my_qr_codes',
      path: '/admin/my_qr_codes',
      label: 'Mes QR codes',
      icon: 'fa-solid fa-qrcode', // Icône pour envoi
      visibleFor: ['USER'],
      children: [],
      subMenuRoutes: [],
    },
    
    {
      id: 'utilisateurs',
      path: '/admin/users',
      label: 'Gestion des utilisateurs',
      icon: 'fa-solid fa-users-gear', // Icône pour réception
      visibleFor: ['ADMIN','SUPER_ADMIN'],
      children: [],
      subMenuRoutes: [],
    },

   
    
  ];
 
  closeCanvas() {
    this.closeOffCanvas.emit(true);
  }

  isActiveSubmenu(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }

  hasPermission(route: any): boolean {
    return !route.visibleFor || route.visibleFor.includes(this.role.getUserRole());
  }
}

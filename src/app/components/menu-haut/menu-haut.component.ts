import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription, Subject } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { PanierService } from 'src/app/services/panier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { AdminService } from 'src/app/services/admin.service';
import { Administrateur } from 'src/app/models/administrateur.model';

@Component({
  selector: 'app-menu-haut',
  templateUrl: './menu-haut.component.html',
  styleUrls: ['./menu-haut.component.scss'],
})
export class MenuHautComponent implements OnInit, AfterViewInit {

  @ViewChild('menuMobile', { static: false }) menuMobile: any;

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  reservations = [];
  panierSubscription: Subscription;
  offres;
  dashboard;
  offresSubscription: Subscription;
  offresSubject = new Subject<boolean>();
  photoURL = '../../../assets/img/user.png';

  connecteEnTantQueAdministrateur = false;
  adminSubscription: Subscription;
  admin: Administrateur;
  primarycolor: boolean;

  screenHeight: number;
  screenWidth: number;
  mobile = true;

  constructor(
    private authService: AuthentificationService,
    private panierService: PanierService,
    private router: ActivatedRoute,
    private route: Router,
    private adminService: AdminService,
    private renderer: Renderer2,
    private elem: ElementRef
  ) {
    this.getScreenSize();
  }

  @HostListener('window:scroll', []) onWindowScroll() {
    // do some stuff here when the window is scrolled
    const verticalOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // console.log('On est en train de scroller');
    // console.log(verticalOffset);
    if (verticalOffset === 0) {
      this.primarycolor = true;
    } else {
      this.primarycolor = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth);
    if (this.screenWidth > 599) {
      this.mobile = false;
    }
  }

  ngAfterViewInit(): void {
    const html = this.menuMobile.nativeElement as HTMLElement;
    setTimeout(() => {
      const elements = this.elem.nativeElement.querySelectorAll('.hamburger');
      console.log('elements');
      console.log(elements);
    }, 2000);
  }

  hamburger() {
    const elements = this.elem.nativeElement.querySelectorAll('.hamburger.active');
    console.log('elements');
    console.log(elements);
    if (elements) {
      if (elements.length) {
        if (elements.length > 0) {
          const element = elements[0];
          element.click();
        }
      }
    }
  }

  check() {
    this.offres = this.route.isActive('offres', false);
    this.dashboard = this.route.isActive('dashboard', false);
    // console.log('this.offres');
    // console.log(this.offres);
  }

  public ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
      if (utilisateur && utilisateur.photoURL) {
        this.photoURL = utilisateur.photoURL;
      } else {
        this.photoURL = '../../../assets/img/user.png';
      }
    });
    this.panierSubscription = this.panierService.panierSubject.subscribe((reservations) => {
      this.reservations = reservations;
    });
    this.panierService.getPanier();
    this.route.events.subscribe(() => {
      this.check();
    });
    this.authService.emit();
    this.adminSubscription = this.adminService.adminSubject.subscribe((admin: Administrateur) => {
      this.admin = admin;
    });
    this.adminService.emit();
  }

  gotoDash() {
    this.check();
    this.route.navigate(['dashboard']);
  }

  deconnexion() {
    const oui = confirm('Etes-vous sûr de vouloir vous déconnecter ?');
    if (oui) {
      this.authService.deconnexion();
      this.route.navigate(['accueil']);
    }
  }

  deconnexionAdmin() {
    const oui = confirm('Etes-vous sûr de vouloir quitter le mode Admin ?');
    if (oui) {
      this.adminService.deconnexion();
      this.route.navigate(['accueil']);
    }
  }

}

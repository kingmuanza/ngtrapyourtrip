import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription, Subject } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { PanierService } from 'src/app/services/panier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-menu-haut',
  templateUrl: './menu-haut.component.html',
  styleUrls: ['./menu-haut.component.scss'],
})
export class MenuHautComponent implements OnInit {

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  reservations = [];
  panierSubscription: Subscription;
  offres;
  offresSubscription: Subscription;
  offresSubject = new Subject<boolean>();
  constructor(
    private authService: AuthentificationService,
    private panierService: PanierService,
    private router: ActivatedRoute,
    private route: Router

  ) {
  }

  check() {
    this.offres = this.route.isActive('offres', false);
    console.log('this.offres');
    console.log(this.offres);
  }

  public ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.panierSubscription = this.panierService.panierSubject.subscribe((reservations) => {
      this.reservations = reservations;
    });
    this.panierService.getPanier();
    this.route.events.subscribe(() => {
      this.check();
    });
  }

}

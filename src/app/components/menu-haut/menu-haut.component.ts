import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { PanierService } from 'src/app/services/panier.service';

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
  constructor(
    private authService: AuthentificationService,
    private panierService: PanierService
  ) { }

  public ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.panierSubscription = this.panierService.panierSubject.subscribe((reservations) => {
      this.reservations = reservations;
    });
    this.panierService.getPanier();
  }

}

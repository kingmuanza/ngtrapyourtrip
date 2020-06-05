import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';

@Component({
  selector: 'app-paiement-edit',
  templateUrl: './paiement-edit.component.html',
  styleUrls: ['./paiement-edit.component.scss']
})
export class PaiementEditComponent implements OnInit {

  reservations = [];
  TOTAL = 0;
  utilisateur: Utilisateur;
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.utilisateur = this.authService.utilisateur;
    if (this.utilisateur) {
      const panierString = localStorage.getItem('panier-trap');
      if (panierString) {
        this.reservations = JSON.parse(panierString);
        this.reservations.forEach((reservation: Reservation) => {
          this.TOTAL += reservation.cout;
          if (this.utilisateur) {
            reservation.utilisateur = this.utilisateur;
          }
        });
      }
    } else {
      this.router.navigate(['inscription']);
    }
  }

}

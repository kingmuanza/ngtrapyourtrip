import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  utilisateur: Utilisateur;
  constructor(
    private router: Router,
    private authService: AuthentificationService
  ) { }

  ngOnInit(): void {
    if (this.authService.utilisateur) {
      this.utilisateur = this.authService.utilisateur;
    } else {
      this.router.navigate(['connexion']);
    }
  }

  nouveauSejour() {

  }

}

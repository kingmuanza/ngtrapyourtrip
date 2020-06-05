import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
declare const metro: any;

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthentificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      login: ['kangudie@gmail.com', [Validators.required]],
      nom: ['Muanza', [Validators.required]],
      prenom: ['Kangudie', []],
      sexe: ['homme', []],
      passe: ['', [Validators.required]],
      confirmation: ['', [Validators.required]]
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);

    const nom = value.nom;
    const prenom = value.prenom;
    const login = value.login;
    const sexe = value.sexe;
    const passe = value.passe;
    const confirmation = value.confirmation;

    const utilisateur = new Utilisateur();
    utilisateur.nom = nom;
    utilisateur.prenom = prenom;
    utilisateur.login = login;
    utilisateur.sexe = sexe;

    if (passe === confirmation) {

      const activity = metro().activity.open({
        type: 'square',
        overlayColor: '#fff',
        overlayAlpha: 0.8
      });

      this.authService.inscription(utilisateur, passe).then(() => {
        metro().activity.close(activity);
        const panierString = localStorage.getItem('panier-trap');
        if (panierString) {
          const reservations = JSON.parse(panierString);
          if (reservations.length > 0) {
            this.router.navigate(['dashboard', 'paiement', 'edit']);
          } else {
            this.router.navigate(['dashboard']);
          }
        }
      }).catch((e) => {
        metro().activity.close(activity);
      });
    } else {
      const notify = metro().notify;
      notify.create('Les mots de passe ne sont pas identiques', null, {
        cls: 'alert',
        keepOpen: true
      });
    }
  }

}

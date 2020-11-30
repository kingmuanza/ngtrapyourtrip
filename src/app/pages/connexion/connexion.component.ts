import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
declare const metro: any;

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

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
      passe: ['', [Validators.required]]
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);

    const login = value.login;
    const passe = value.passe;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.authService.connexion(login, passe).then((utilisateur) => {
      metro().activity.close(activity);
      const panierString = localStorage.getItem('panier-trap');
      localStorage.setItem('trap-your-utilisateur', JSON.stringify(utilisateur));
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

  }

}

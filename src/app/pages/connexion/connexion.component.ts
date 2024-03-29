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

  errormessage = '';

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
      login: ['', [Validators.required]],
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
    this.errormessage = '';
    this.authService.connexion(login, passe).then((utilisateur) => {
      metro().activity.close(activity);
      const panierString = localStorage.getItem('panier-trap');
      localStorage.setItem('trap-your-utilisateur', JSON.stringify(utilisateur));
      this.redirection();
    }).catch((e) => {
      metro().activity.close(activity);
      const notify = metro().notify;
      this.errormessage = 'Login ou mot de passe incorrect';
    });

  }

  redirection() {
    const connexionString = localStorage.getItem('connexion-url');
    if (connexionString) {
      this.router.navigate(['offres', 'reservation', 'infos', connexionString]);
    } else {
      this.router.navigate(['accueil']);
    }
  }

  connexionGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        const credential = result.credential;
        const user = result.user;
        console.log('user');
        console.log(user);
        localStorage.setItem('trap-your-utilisateur', JSON.stringify(user));
        this.authService.connexionExterne(user);
        this.redirection();
        // ...
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        alert('Echec de la connexion');
        // ...
      });
  }

  connexionFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        const credential = result.credential;
        const user = result.user;
        console.log('user');
        console.log(user);
        localStorage.setItem('trap-your-utilisateur', JSON.stringify(user));
        this.authService.connexionExterne(user);
        this.redirection();
        // ...
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.log(error);
        alert('Echec de la connexion');
      });
  }

}

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
  messageEmail = '';
  messagePasse = '';

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
    utilisateur.displayName = prenom + ' ' + nom;
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
        localStorage.setItem('trap-your-utilisateur', JSON.stringify(utilisateur));
        const panierString = localStorage.getItem('panier-trap');
        if (panierString) {
          const reservations = JSON.parse(panierString);
          if (reservations.length > 0) {
            this.router.navigate(['dashboard', 'paiement', 'edit']);
          } else {
            this.router.navigate(['inscription', 'photo']);
          }
        }
      }).catch((e) => {
        console.log('erreur dinscription');
        console.log(e);
        metro().activity.close(activity);
        const notify = metro().notify;
        if (e.code === 'auth/email-already-in-use') {
          this.messageEmail = 'Email déjà utilisé';
          notify.create('Email déjà utilisé', null, {
            cls: 'alert notify-marge',
            keepOpen: false,
            position: 'bottom right',
            elementPosition: 'bottom right',
            globalPosition: 'bottom right',
          });
        } else {
          notify.create('Les mots de passe ne sont pas identiques', null, {
            cls: 'alert notify-marge',
            keepOpen: false,
            position: 'bottom right',
            elementPosition: 'bottom right',
            globalPosition: 'bottom right',
          });
        }
      });
    } else {
      const notify = metro().notify;
      this.messagePasse = 'Les mots de passe ne sont pas identiques';
      console.log('Les mots de passe ne sont pas identiques');
      notify.create('Les mots de passe ne sont pas identiques', null, {
        cls: 'alert',
        keepOpen: false
      });
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
        this.authService.connexionExterne(user);
        this.envoiMail(user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
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
        this.authService.connexionExterne(user);
        this.envoiMail(user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.log(error);
      });
  }

  envoiMail(user: firebase.User) {
    console.log('envoiMail');
    console.log(user);
    console.log(user.displayName);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        const reponseOrange = JSON.parse((xhr.responseText));
        console.log(reponseOrange);
      }
    });
    const lien = '/trapyourtripback/envoi_email_inscription.php?';
    xhr.open('GET', lien + 'email=' + user.email + '&nom=' + user.displayName);
    xhr.send();
  }

  envoiMail2(user: Utilisateur) {
    console.log('envoiMail');
    console.log(user);
    console.log(user.displayName);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        const reponseOrange = JSON.parse((xhr.responseText));
        console.log(reponseOrange);
      }
    });
    const lien = '/trapyourtripback/envoi_email_inscription.php?';
    xhr.open('GET', lien + 'email=' + user.login + '&nom=' + user.displayName);
    xhr.send();
  }

}

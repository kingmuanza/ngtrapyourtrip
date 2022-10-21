import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import * as firebase from 'firebase';
declare const metro: any;

@Component({
  selector: 'app-oubli',
  templateUrl: './oubli.component.html',
  styleUrls: ['./oubli.component.scss']
})
export class OubliComponent implements OnInit {

  form: FormGroup;
  message = '';
  terminee = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthentificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    let utilisateur: Utilisateur;
    const email = localStorage.getItem('trap-your-utilisateur');
    if (email) {
      utilisateur = JSON.parse(email);
    }
    this.form = this.formBuilder.group({
      login: [utilisateur ? utilisateur.login : '', [Validators.required]]
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);

    const login = value.login;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const db = firebase.firestore();
    let ya = false;
    db.collection('utilisateurs-trap').where('login', '==', login).get().then((resultats) => {
      resultats.forEach((resultat) => {
        if (resultat.exists) {
          ya = true;
        }
      });
      if (ya) {
        const auth = firebase.auth();
        const actionCodeSettings = {
          url: 'https://trapyourtrip.com',
          handleCodeInApp: true,
          // When multiple custom dynamic link domains are defined, specify which
          // one to use.
          // dynamicLinkDomain: 'trapyourtrip.web.app'
        };
        auth.sendPasswordResetEmail(login, actionCodeSettings).then(() => {
          this.terminee = true;
          this.message = 'Un email a été envoyé à l\'adresse ' + login;
        });
      } else {
        this.message = 'Aucun utilisateur trouvé';
      }
    });

    metro().activity.close(activity);

  }

}

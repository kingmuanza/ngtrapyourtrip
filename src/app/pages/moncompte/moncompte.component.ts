import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import * as firebase from 'firebase';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moncompte',
  templateUrl: './moncompte.component.html',
  styleUrls: ['./moncompte.component.scss']
})
export class MoncompteComponent implements OnInit {
  form: FormGroup;
  messageEmail = '';
  messagePasse = '';
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthentificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.authService.emit();
  }

  initForm() {
    this.form = this.formBuilder.group({
      ancien: ['', [Validators.required]],
      passe: ['', [Validators.required]],
      confirmation: ['', [Validators.required]]
    });

    this.form.valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);

      if (value.passe === value.confirmation) {
        this.messagePasse = '';
      } else {
        this.messagePasse = 'Les mots de passe ne sont pas identiques';
      }

      if (value.passe && value.passe.length < 6) {
        this.messagePasse = 'Le mot de passe doit avoir au moins 6 caractères';
      }
    });
  }

  onFormSubmit() {
    const auth = firebase.auth();
    const value = this.form.value;
    const ancien = value.ancien;
    const passe = value.ancien;
    const confirmation = value.confirmation;

    auth.signInWithEmailAndPassword(this.utilisateur.login, ancien).then(() => {
      if (passe === confirmation) {
        const user = auth.currentUser;
        console.log('user');
        console.log(user);
        user.updatePassword(passe).then(() => {
          this.authService.deconnexion();
          this.router.navigate(['accueil']);
        });
      }
    }).catch((e) => {
      console.log('erreur');
      console.log(e);
    });
  }

}

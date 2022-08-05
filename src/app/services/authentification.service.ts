import { Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur.model';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { PanierService } from './panier.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  utilisateur: Utilisateur;
  utilisateurSubject = new Subject();
  constructor(
    private panierService: PanierService
  ) { }

  emit() {
    this.utilisateurSubject.next(this.utilisateur);
  }

  inscription(utilisateur: Utilisateur, passe: string) {
    return new Promise((resolve, reject) => {
      const auth = firebase.auth();
      const db = firebase.firestore();
      auth.createUserWithEmailAndPassword(utilisateur.login, passe).then((resultat) => {
        utilisateur.id = resultat.user.uid;
        utilisateur.uid = resultat.user.uid;
        db.collection('utilisateurs-trap').doc(utilisateur.id).set(JSON.parse(JSON.stringify(utilisateur))).then((resultats) => {
          console.log('TERMINEEE !!!');
          this.utilisateur = utilisateur;
          this.emit();
          resolve(utilisateur);
        }).catch((e) => {
          reject(e);
        });
      }).catch((e) => {
        if (e.code === 'auth/email-already-in-use') {
          reject(e);
        } else {
          reject(e);
        }
      });
    });
  }

  connexion(login: string, passe: string) {
    return new Promise((resolve, reject) => {
      const auth = firebase.auth();
      const db = firebase.firestore();
      auth.signInWithEmailAndPassword(login, passe).then((resultat) => {
        const id = resultat.user.uid;
        db.collection('utilisateurs-trap').doc(id).get().then((r) => {
          this.utilisateur = r.data() as Utilisateur;
          console.log('TERMINEEE !!!');
          this.emit();
          resolve(this.utilisateur);
        }).catch((e) => {
          reject(e);
        });
      }).catch((e) => {
        reject(e);
      });
    });
  }

  connexionExterne(utilisateur: any) {
    this.utilisateur = utilisateur;
    this.utilisateur.nom = utilisateur.displayName;
    console.log('TERMINEEE !!!');
    this.emit();
  }

  deconnexion() {
    this.utilisateur = null;
    localStorage.removeItem('trap-your-utilisateur');
    this.deletePanier();
    this.emit();
  }

  deletePanier() {
    localStorage.removeItem('panier-trap');
    this.panierService.reservations = [];
    this.panierService.emit();
    this.emit();
  }
}

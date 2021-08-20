import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Administrateur } from '../models/administrateur.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  administrateur: Administrateur;
  connecteEnTantQueAdministrateur = false;
  subject = new Subject<boolean>();
  adminSubject = new Subject<Administrateur>();

  constructor() { }

  connexion(login: string, passe: string): Promise<Administrateur> {
    return new Promise((resolve, reject) => {
      console.log('Connexion en tant que admin');
      this.getAdmin(login, passe).then((admin) => {
        console.log('admin trouvé');
        console.log(admin);
        this.administrateur = admin;
        this.connecteEnTantQueAdministrateur = true;
        this.emit();
        resolve(admin);
      }).catch((e) => {
        console.log('aucun admin');
        console.log(e);
        reject(e);
      });
    });
  }

  deconnexion() {
    this.administrateur = null;
    this.connecteEnTantQueAdministrateur = false;
    this.emit();
  }

  getAdmin(login: string, passe: string): Promise<Administrateur> {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      let admin: Administrateur;
      db.collection('administrateurs').where('login', '==', login).get().then((resultats) => {
        resultats.forEach((resultat) => {
          const a = resultat.data() as Administrateur;
          if (a.passe === passe) {
            admin = a;
          }
        });
        if (admin) {
          resolve(admin);
        } else {
          reject(null);
        }
      });
    });
  }

  emit() {
    this.subject.next(this.connecteEnTantQueAdministrateur);
    this.adminSubject.next(this.administrateur);
  }

  createAdmin() {

  }

}

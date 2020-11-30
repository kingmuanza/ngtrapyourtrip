import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @ViewChild('fileButton', { static: false }) fileButton;

  file: File;
  photoURL = '../../../../assets/img/user.png';
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  edit = false;

  constructor(
    private router: Router,
    private authService: AuthentificationService,
  ) { }

  ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
      localStorage.setItem('trap-your-utilisateur', JSON.stringify(utilisateur));
      if (utilisateur.photoURL) {
        this.photoURL = utilisateur.photoURL;
      }
    });
    this.authService.emit();
  }

  editer() {
    this.edit = true;
  }

  galerie() {
    this.fileButton.nativeElement.click();
  }

  uploadFile(event: any) {
    console.log(event.target.files);

    this.file = event.target.files.item(0);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.photoURL = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  suivant() {
    console.log('clic sur suivant');
    const utilisateurString = localStorage.getItem('trap-your-utilisateur');

    console.log('utilisateurString');
    console.log(utilisateurString);
    if (utilisateurString) {
      let utilisateur: Utilisateur;
      utilisateur = JSON.parse(utilisateurString);
      if (this.utilisateur) {
        utilisateur = this.utilisateur;
      }
      this.save().then((url) => {
        console.log('url');
        console.log(url);
        if (url) {
          utilisateur.photoURL = url;
        }
        this.authService.utilisateur = utilisateur;
        this.authService.emit();
        const db = firebase.firestore();
        db.collection('utilisateurs-trap').doc(utilisateur.id).set(JSON.parse(JSON.stringify(utilisateur))).then((resultats) => {
          console.log('TERMINEEE !!!');
          const panierString = localStorage.getItem('panier-trap');
          this.edit = false;
          if (panierString) {
            const reservations = JSON.parse(panierString);
            if (reservations.length > 0) {
              // this.router.navigate(['dashboard', 'paiement', 'edit']);
            } else {
              // this.router.navigate(['dashboard']);
            }
          } else {
            // this.router.navigate(['dashboard']);
          }
        }).catch((e) => {

        });
      });
    } else {
      this.router.navigate(['inscription']);
    }
  }

  save(): Promise<string> {
    console.log('save this file');
    console.log(this.file);
    return new Promise((resolve, reject) => {
      if (this.file) {
        const fichier = this.file;
        const storageRef = firebase.storage().ref('pp/' + Math.floor(Math.random() * 1000000) + fichier.name);
        const task = storageRef.put(fichier);
        task.then((data) => {
          console.log('data');
          console.log(data);
          const imageUrl = storageRef.getDownloadURL().then((url) => {
            resolve(url);
          });
        });
      } else {
        resolve(null);
      }
    });
  }

}

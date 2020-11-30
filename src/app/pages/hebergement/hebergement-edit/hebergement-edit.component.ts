import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { Router } from '@angular/router';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Prestataire } from 'src/app/models/prestataire.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
declare const metro: any;

@Component({
  selector: 'app-hebergement-edit',
  templateUrl: './hebergement-edit.component.html',
  styleUrls: ['./hebergement-edit.component.scss']
})
export class HebergementEditComponent implements OnInit {

  @Input() hebergement?: Hebergement;
  form: FormGroup;
  fichiers: FileList;
  images = new Array<Blob>();
  liens = new Array<string>();
  prestataires = new Array<Utilisateur>();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getPrestataires();
  }

  getPrestataires() {
    this.prestataires = [];
    const db = firebase.firestore();
    db.collection('utilisateurs-trap').get().then((resultats) => {
      console.log('TERMINEEE !!!');
      resultats.forEach((resultat) => {
        const prestataire = resultat.data() as Utilisateur;
        if (prestataire.prestataire) {
          this.prestataires.unshift(prestataire);
        }
      });
      this.initForm();
    }).catch((e) => {
    });
  }

  retirerImage(image) {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette image ?');
    if (oui) {
      const images = [];
      this.hebergement.images.forEach((img) => {
        if (image !== img) {
          images.push(img);
        }
      });
      this.hebergement.images = images;
    }
  }

  initForm() {
    let prestataire;
    this.prestataires.forEach((p) => {
      if (this.hebergement && this.hebergement.prestataire && p.id === this.hebergement.prestataire.id) {
        prestataire = p;
      }
    });
    this.form = this.formBuilder.group({
      titre: [this.hebergement ? this.hebergement.titre : 'Appartement meublé', [Validators.required]],
      description: [this.hebergement ? this.hebergement.description : 'Appartement meublé une cuisine', [Validators.required]],
      nuitee: [this.hebergement ? this.hebergement.nuitee : '50000', [Validators.required]],
      lieu: [this.hebergement ? this.hebergement.lieu : 'Etoa meki, Yaoundé', [Validators.required]],
      tel: [this.hebergement ? this.hebergement.tel : '696543495', [Validators.required]],
      pays: [this.hebergement ? this.hebergement.pays : 'Cameroun', [Validators.required]],
      ville: [this.hebergement ? this.hebergement.ville : 'Yaoundé', [Validators.required]],
      prestataire: [this.hebergement ? prestataire : '', []],

      baignoire: [this.hebergement && this.hebergement.options ? this.hebergement.options.baignoire : true],
      bouilloire: [this.hebergement && this.hebergement.options ? this.hebergement.options.bouilloire : false],
      climatiseur: [this.hebergement && this.hebergement.options ? this.hebergement.options.climatiseur : false],
      litdouble: [this.hebergement && this.hebergement.options ? this.hebergement.options.litdouble : false],
      litsimple: [this.hebergement && this.hebergement.options ? this.hebergement.options.litsimple : false],
      minibar: [this.hebergement && this.hebergement.options ? this.hebergement.options.minibar : false],
      tele: [this.hebergement && this.hebergement.options ? this.hebergement.options.tele : false],
      wifi: [this.hebergement && this.hebergement.options ? this.hebergement.options.wifi : false],

      notation: [this.hebergement ? this.hebergement.notation : '3', [Validators.required]],
      tags: [this.hebergement ? this.hebergement.tags : ''],
    });

    this.form.controls.prestataire.valueChanges.subscribe((val) => {
      console.log('preestataires');
      console.log(val);
    });
  }

  onFormSubmit() {
    const value = this.form.value;

    const titre = value.titre;
    const description = value.description;
    const nuitee = value.nuitee;
    const lieu = value.lieu;
    const pays = value.pays;
    const ville = value.ville;
    const tel = value.tel;
    const wifi = value.wifi;
    const parking = value.parking;
    const notation = value.notation;
    const prestataire = value.prestataire;

    let hebergement = new Hebergement();
    if (this.hebergement) {
      hebergement = this.hebergement;
    }
    hebergement.titre = titre;
    hebergement.description = description;
    hebergement.nuitee = nuitee;
    hebergement.lieu = lieu;
    hebergement.pays = pays;
    hebergement.ville = ville;
    hebergement.tel = tel;
    hebergement.wifi = wifi;
    hebergement.parking = parking;
    hebergement.notation = notation;
    hebergement.prestataire = prestataire;

    hebergement.options.baignoire = value.baignoire;
    hebergement.options.bouilloire = value.bouilloire;
    hebergement.options.climatiseur = value.climatiseur;
    hebergement.options.litdouble = value.litdouble;
    hebergement.options.litsimple = value.litsimple;
    hebergement.options.minibar = value.minibar;
    hebergement.options.tele = value.tele;
    hebergement.options.wifi = value.wifi;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      if (hebergement.images) {
        hebergement.images = hebergement.images.concat(liens);
      } else {
        hebergement.images = liens;
      }
      const db = firebase.firestore();
      db.collection('hebergements-trap').doc(hebergement.id).set(JSON.parse(JSON.stringify(hebergement))).then(() => {
        console.log('TERMINEEE !!!');
        const utilisateur = hebergement.prestataire;
        const keys = Object.keys(hebergement.options);
        if (utilisateur.options) {

        } else {
          utilisateur.options = new Object() as any;
        }

        keys.forEach((key) => {
          // utilisateur.options[key] = utilisateur.options[key] || hebergement.options[key];
        });

        if (!utilisateur.prixMin) {
          utilisateur.prixMin = 1000000;
        }

        utilisateur.prixMin = Math.min(utilisateur.prixMin, hebergement.nuitee);

        db.collection('utilisateurs-trap').doc(utilisateur.id).update({
          prixMin: utilisateur.prixMin
        }).then(() => {
          metro().activity.close(activity);
          this.router.navigate(['offres', 'hebergement']);
        });
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });

  }

  uploadFile(event: any) {
    console.log(event.target.files);

    this.fichiers = event.target.files;
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < this.fichiers.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const resultat = e.target.result;
          console.log('resultat ' + i);
          console.log(resultat);
          this.images.push(resultat);
        };
        reader.readAsDataURL(event.target.files[i]);
      }

    }
  }

  save(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      if (this.fichiers) {
        for (let i = 0; i < this.fichiers.length; i++) {
          const fichier = this.fichiers[i];
          const storageRef = firebase.storage().ref('sejours/' + Math.floor(Math.random() * 1000000) + fichier.name);
          const task = storageRef.put(this.fichiers[i]);
          task.then((data) => {
            console.log('data');
            console.log(data);
            const imageUrl = storageRef.getDownloadURL().then((url) => {
              this.liens.push(url);
              console.log('liens');
              console.log(this.liens);
              if (this.liens.length === this.fichiers.length) {
                resolve(this.liens);
              }
            });
          });
        }
      } else {
        resolve([]);
      }

    });
  }

}

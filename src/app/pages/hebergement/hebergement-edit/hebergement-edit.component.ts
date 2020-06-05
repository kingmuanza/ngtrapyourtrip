import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { Router } from '@angular/router';
import { Hebergement } from 'src/app/models/hebergement.model';
declare const metro: any;

@Component({
  selector: 'app-hebergement-edit',
  templateUrl: './hebergement-edit.component.html',
  styleUrls: ['./hebergement-edit.component.scss']
})
export class HebergementEditComponent implements OnInit {

  form: FormGroup;
  fichiers: FileList;
  images = new Array<Blob>();
  liens = new Array<string>();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      titre: ['Appartement meublé', Validators.required],
      description: ['Appartement meublé avec 2 chambres, un salon, une cuisine', Validators.required],
      nuitee: ['50000', Validators.required],
      lieu: ['Etoa meki, Yaoundé', Validators.required],
      tel: ['696543495', Validators.required],
      wifi: [true, Validators.required],
      parking: [false, Validators.required],
      notation: ['3', Validators.required],
      tags: ['', Validators.required],
    });
  }

  onFormSubmit() {
    const value = this.form.value;

    const titre = value.titre;
    const description = value.description;
    const nuitee = value.nuitee;
    const lieu = value.lieu;
    const tel = value.tel;
    const wifi = value.wifi;
    const parking = value.parking;
    const notation = value.notation;

    const hebergement = new Hebergement();
    hebergement.titre = titre;
    hebergement.description = description;
    hebergement.nuitee = nuitee;
    hebergement.lieu = lieu;
    hebergement.tel = tel;
    hebergement.wifi = wifi;
    hebergement.parking = parking;
    hebergement.notation = notation;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      hebergement.images = liens;
      const db = firebase.firestore();
      db.collection('hebergements-trap').doc(hebergement.id).set(JSON.parse(JSON.stringify(hebergement))).then(() => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['hebergement']);
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
    });
  }

}

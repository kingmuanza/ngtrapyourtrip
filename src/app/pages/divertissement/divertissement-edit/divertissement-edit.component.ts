import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Divertissement } from 'src/app/models/divertissement.model';
declare const metro: any;

@Component({
  selector: 'app-divertissement-edit',
  templateUrl: './divertissement-edit.component.html',
  styleUrls: ['./divertissement-edit.component.scss']
})
export class DivertissementEditComponent implements OnInit {

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
      titre: ['Balade en Pirogue', Validators.required],
      description: ['Baladez-vous en pirogue près des crocodiles sauvages', Validators.required],
      prix: ['50000', Validators.required],
      lieu: ['Mbalmayo', Validators.required],
      tel: ['696543495', Validators.required],
      notation: ['5', Validators.required],
      tags: ['', Validators.required],
    });
  }

  onFormSubmit() {
    const value = this.form.value;

    const titre = value.titre;
    const description = value.description;
    const prix = value.prix;
    const lieu = value.lieu;
    const tel = value.tel;
    const notation = value.notation;
    const tags = value.tags;

    const divertissement = new Divertissement();
    divertissement.titre = titre;
    divertissement.description = description;
    divertissement.prix = prix;
    divertissement.lieu = lieu;
    divertissement.tel = tel;
    divertissement.notation = notation;
    divertissement.tags = tags;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    console.log('Activité est lancé');

    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      divertissement.images = liens;
      const db = firebase.firestore();
      db.collection('divertissements-trap').doc(divertissement.id).set(JSON.parse(JSON.stringify(divertissement))).then(() => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['divertissement']);
      }).catch(() => {
        metro().activity.close(activity);
      });
    }).catch(() => {
      console.log('Il ya un pb avec les images');
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

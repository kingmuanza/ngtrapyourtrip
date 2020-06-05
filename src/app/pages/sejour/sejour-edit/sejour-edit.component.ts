import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { Router } from '@angular/router';
declare const metro: any;

@Component({
  selector: 'app-sejour-edit',
  templateUrl: './sejour-edit.component.html',
  styleUrls: ['./sejour-edit.component.scss']
})
export class SejourEditComponent implements OnInit {

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
      prixUnitaire: ['500', Validators.required],
      ville: ['Kribi', Validators.required],
      description: ['Profitez de la meilleure station balnéaire du Cameroun', Validators.required],
      titre: ['Allons à Kribi', Validators.required],
      tags: ['', Validators.required],
      notation: ['4', Validators.required],
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    const prixUnitaire = value.prixUnitaire;
    const ville = value.ville;
    const description = value.description;
    const notation = value.notation;
    const titre = value.titre;
    const tags = value.tags;

    const sejour = new Sejour();
    sejour.prixUnitaire = prixUnitaire;
    sejour.ville = ville;
    sejour.description = description;
    sejour.notation = notation;
    sejour.titre = titre;
    sejour.tags = tags;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      sejour.images = liens;
      const db = firebase.firestore();
      db.collection('sejours-trap').doc(sejour.id).set(JSON.parse(JSON.stringify(sejour))).then(() => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['sejour']);
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

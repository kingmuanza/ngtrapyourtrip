import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { Router } from '@angular/router';
import { Transport } from 'src/app/models/transport.model';
declare const metro: any;

@Component({
  selector: 'app-transport-edit',
  templateUrl: './transport-edit.component.html',
  styleUrls: ['./transport-edit.component.scss']
})
export class TransportEditComponent implements OnInit {

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
      prixUnitaire: ['50000', Validators.required],
      description: ['Louer cette magnifique voiture pour ce transport de ville', Validators.required],
      titre: ['Hummer H3', Validators.required],
      tags: ['', Validators.required],
      notation: ['4', Validators.required]
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    const prixUnitaire = value.prixUnitaire;
    const description = value.description;
    const notation = value.notation;
    const titre = value.titre;
    const tags = value.tags;

    const transport = new Transport();
    transport.prixUnitaire = prixUnitaire;
    transport.description = description;
    transport.notation = notation;
    transport.titre = titre;
    transport.tags = tags;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      transport.images = liens;
      const db = firebase.firestore();
      db.collection('transports-trap').doc(transport.id).set(JSON.parse(JSON.stringify(transport))).then(() => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['transport']);
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
        const storageRef = firebase.storage().ref('transports/' + Math.floor(Math.random() * 1000000) + fichier.name);
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
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
  divertissement = new Divertissement();
  nouveau = true;
  type = 'restaurant';
  dateDiver = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      console.log('id');
      console.log(id);
      if (id) {
        this.getDivertissement(id).then((divertissement) => {

          this.divertissement = divertissement;
          this.nouveau = false;
          if (divertissement.date) {
            this.type = 'evenement';
            this.divertissement.date = new Date(divertissement.date);
            this.dateDiver = this.divertissement.date.toISOString().split('T')[0];
          }
          if (divertissement.restaurant) {
            this.type = 'restaurant';
          }
          console.log('this.divertissement.restaurant');
          console.log(this.divertissement.restaurant);

        });
      }
    });
  }

  enregistrer() {
    console.log('this.divertissement');
    console.log(this.dateDiver);
    this.divertissement.date = new Date(this.dateDiver);
    console.log(this.divertissement);

    this.saveImages().then((liens) => {
      this.images = [];
      if (this.divertissement.images) {
        this.divertissement.images = this.divertissement.images.concat(liens);
      } else {
        this.divertissement.images = liens;
      }
      console.log(this.divertissement);
      this.save();
    });
  }

  save() {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    db.collection('divertissements-trap').doc(this.divertissement.id)
      .set(JSON.parse(JSON.stringify(this.divertissement))).then((resultat) => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        if (this.divertissement.date) {
          this.router.navigate(['offres', 'divertissement', 'evenements']);
        } else if (this.divertissement.restaurant) {
          this.router.navigate(['offres', 'divertissement', 'restaurants']);
        } else {
          this.router.navigate(['offres', 'divertissement', 'loisirs']);
        }
      }).catch((e) => {
        metro().activity.close(activity);
      });
  }

  toDate(date) {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }
    return null;
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

  saveImages(): Promise<Array<string>> {
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

  getDivertissement(id): Promise<Divertissement> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-trap').doc(id).get().then((resultat) => {
        const div = resultat.data() as Divertissement;
        resolve(div);
      });
    });
  }

}

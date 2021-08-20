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
  divertissement: Divertissement;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      console.log('id');
      console.log(id);
      if (id) {
        this.getDivertissement(id).then((divertissement) => {
          this.divertissement = divertissement;
          this.initForm();
          console.log('this.divertissement.restaurant');
          console.log(this.divertissement.restaurant);
        });
      }
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      titre: [this.divertissement ? this.divertissement.titre : 'Concert géant', Validators.required],
      description: [this.divertissement ? this.divertissement.description : 'Venez vivre le show', Validators.required],
      prix: [this.divertissement ? this.divertissement.prix : '50000', Validators.required],
      lieu: [this.divertissement ? this.divertissement.lieu : 'Yaoundé', Validators.required],
      ville: [this.divertissement ? this.divertissement.ville : 'Yaoundé', Validators.required],
      date: [this.divertissement ? this.toDate(this.divertissement.date) : null, Validators.required],
      tel: [this.divertissement ? this.divertissement.tel : '696543495', Validators.required],
      notation: [this.divertissement ? this.divertissement.notation : '5', Validators.required],
      tags: ['', Validators.required],
      restaurant: [this.divertissement ? this.divertissement.restaurant : false]
    });
  }

  toDate(date) {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }
    return null;
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('divertissemnt');
    console.log(value);

    const titre = value.titre;
    const description = value.description;
    const prix = value.prix;
    const lieu = value.lieu;
    const ville = value.ville;
    const tel = value.tel;
    const notation = value.notation;
    const tags = value.tags;
    const date = value.date;
    const restaurant = value.restaurant;

    let divertissement = new Divertissement();
    if (this.divertissement) {
      divertissement = this.divertissement;
    }
    divertissement.titre = titre;
    divertissement.description = description;
    divertissement.prix = prix;
    divertissement.lieu = lieu;
    divertissement.ville = ville;
    divertissement.tel = tel;
    divertissement.notation = notation;
    divertissement.tags = tags;
    if (restaurant) {
      divertissement.restaurant = true;
    }
    if (date) {
      console.log('ya date');
      divertissement.date = new Date(date);
    } else {
      console.log('ya pas date');
      divertissement.date = null;
    }
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    console.log('Activité est lancé');
    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      if (liens) {
        divertissement.images = liens;
      }
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
        resolve(null);
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

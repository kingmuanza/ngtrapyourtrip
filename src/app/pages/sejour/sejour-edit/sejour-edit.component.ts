import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Prestataire } from 'src/app/models/prestataire.model';
import { Divertissement } from 'src/app/models/divertissement.model';
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
  sejour: Sejour;

  prestataires = new Array<Utilisateur>();
  hebergements = new Array<Hebergement>();
  resultatsHebergements = new Array<Hebergement>();
  hebergement: Hebergement;

  divertissements = new Array<Divertissement>();
  mesDivertissements = new Array<Divertissement>();
  divertissementsGood = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getPrestataires();
    this.getHebergements();
    this.getDivertissements();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id).then((sejour) => {
          this.sejour = sejour;
          this.hebergement = this.sejour.pack?.hebergement;
          this.mesDivertissements = this.sejour.pack?.divertissements;
          this.initForm();
        });
      }
    });
  }

  getSejour(id: string): Promise<Sejour> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('sejours-trap').doc(id).get().then((resultat) => {
        const sejour = resultat.data() as Sejour;
        this.sejour = sejour;
        console.log('TERMINEEE !!!');
        console.log(this.sejour);
        resolve(sejour);
      }).catch((e) => {
      });
    });
  }

  compareTech(t1: Divertissement, t2: Divertissement): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  initForm() {
    let prestataire;
    this.prestataires.forEach((p) => {
      if (this.sejour && this.sejour.pack?.hebergement && p.id === this.sejour.pack.hebergement.prestataire.id) {
        prestataire = p;
      }
    });
    let hebergement;
    if (this.sejour) {
      hebergement = this.sejour.pack?.hebergement;
    }
    const divertissements = new Array<Divertissement>();
    if (this.sejour) {
      if (this.sejour.pack) {
        if (this.sejour.pack.divertissements) {
          this.divertissements.forEach((d2) => {
            this.sejour.pack.divertissements.forEach((d1) => {
              if (d1.id === d2.id) {
                divertissements.push(d2);
              }
            });
          });
        }
      }
    }
    const description = 'Profitez de la meilleure station balnéaire du Cameroun';
    this.form = this.formBuilder.group({
      prixUnitaire: [this.sejour ? this.sejour.prixUnitaire : '0', Validators.required],
      ville: [this.sejour ? this.sejour.ville : 'Kribi', Validators.required],
      description: [this.sejour ? this.sejour.description : description, Validators.required],
      titre: [this.sejour ? this.sejour.titre : 'Séjour du feu', Validators.required],
      tags: ['', Validators.required],
      notation: [this.sejour ? this.sejour.notation : '3', Validators.required],

      prestataire: [this.sejour ? prestataire : '0', []],
      hebergement: [this.sejour ? hebergement : '0', []],

      dateDebut: [this.sejour ? this.toDateString(this.sejour.dateDebut) : null, []],
      dateFin: [this.sejour ? this.toDateString(this.sejour.dateFin) : null, []],

      divertissements: [this.sejour ? divertissements : [], []],
    });

    if (this.sejour) {
      console.log('this.form.value');
      console.log(this.form.value);
    }

    this.form.controls.prestataire.valueChanges.subscribe((val: Prestataire) => {
      console.log('prestataire');
      console.log(val);
      this.resultatsHebergements = this.hebergements.filter((h) => {
        if (h.prestataire) {
          return h.prestataire.id === val.id;
        }
      });
      console.log('resultatsHebergements');
      console.log(this.resultatsHebergements.length);
    });
    this.form.controls.hebergement.valueChanges.subscribe((val: Hebergement) => {
      console.log('hebergement');
      console.log(val);
      if (val && val.id) {
        this.hebergement = val;
      } else {
        this.hebergement = null;
      }
    });
    this.form.controls.divertissements.valueChanges.subscribe((val: Array<Divertissement>) => {
      console.log('divertissements');
      console.log(val);
      if (val.length > 0) {
        this.mesDivertissements = val;
      } else {
        this.mesDivertissements = [];
      }
    });
  }

  toDateString(date) {
    if (date) {
      return new Date(date).toISOString().split('T')[0];
    }
    return null;
  }

  onFormSubmit() {
    const value = this.form.value;
    const prixUnitaire = value.prixUnitaire;
    const ville = value.ville;
    const description = value.description;
    const notation = value.notation;
    const titre = value.titre;
    const tags = value.tags;

    let sejour = new Sejour();
    if (this.sejour) {
      sejour = this.sejour;
    }
    sejour.dateDebut = new Date(value.dateDebut);
    sejour.dateFin = new Date(value.dateFin);

    sejour.prixUnitaire = prixUnitaire;
    sejour.ville = ville;
    sejour.description = description;
    sejour.notation = notation;
    sejour.titre = titre;
    sejour.tags = tags;
    if (this.hebergement) {
      if (sejour.pack) {
        sejour.pack.hebergement = this.hebergement;
      } else {
        sejour.pack = {
          hebergement: this.hebergement,
          transportAller: null,
          transportRetour: null,
          transportInterne: null,
          divertissements: []
        };
      }
    }
    if (this.mesDivertissements) {
      if (sejour.pack) {
        sejour.pack.divertissements = this.mesDivertissements;
      } else {
        sejour.pack = {
          hebergement: null,
          transportAller: null,
          transportRetour: null,
          transportInterne: null,
          divertissements: this.mesDivertissements
        };
      }
    }

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.save().then((liens) => {
      console.log('liens');
      console.log(liens);
      sejour.images = liens;
      if (this.hebergement) {
        sejour.images = sejour.images.concat(this.hebergement.images);
      }
      if (this.mesDivertissements) {
        this.mesDivertissements.forEach((d) => {
          sejour.images = sejour.images.concat(d.images);
        });
      }
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

  getHebergements() {
    this.hebergements = [];
    const db = firebase.firestore();
    db.collection('hebergements-trap').get().then((resultats) => {
      console.log('TERMINEEE !!!');
      resultats.forEach((resultat) => {
        const hebergement = resultat.data() as Hebergement;
        this.hebergements.unshift(hebergement);
      });
      this.initForm();
    }).catch((e) => {
    });
  }

  getDivertissements() {
    this.divertissements = [];
    const db = firebase.firestore();
    db.collection('divertissements-trap').get().then((resultats) => {
      console.log('TERMINEEE !!!');
      resultats.forEach((resultat) => {
        const divertissement = resultat.data() as Divertissement;
        this.divertissements.unshift(divertissement);
      });
      this.initForm();
      setTimeout(() => {
        this.divertissementsGood = true;
      }, 2000);
    }).catch((e) => {
    });
  }

}

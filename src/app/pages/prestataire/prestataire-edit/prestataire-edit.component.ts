import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Prestataire } from 'src/app/models/prestataire.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
declare const metro: any;

@Component({
  selector: 'app-prestataire-edit',
  templateUrl: './prestataire-edit.component.html',
  styleUrls: ['./prestataire-edit.component.scss']
})
export class PrestataireEditComponent implements OnInit {

  @Input() prestataire?: Utilisateur;
  form: FormGroup;
  fichiers: FileList;
  images = new Array<Blob>();
  liens = new Array<string>();
  hotel = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        const db = firebase.firestore();
        db.collection('utilisateurs-trap').doc(id).get().then((resultat) => {
          const prestataire = resultat.data() as Utilisateur;
          this.prestataire = prestataire;
          console.log('prestataire');
          console.log(prestataire);
          this.initForm();
        }).catch((e) => {
        });
      }
    });
  }

  retirerImage(image) {
    const oui = confirm('Etes-vous sûr de vouloir supprimer cette image ?');
    if (oui) {
      this.prestataire.photoURL = image;
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom: [this.prestataire ? this.prestataire.nom : 'Hôtel Parigo', [Validators.required]],
      description: [this.prestataire ? this.prestataire.description : 'Hôtel 5 étoiles', [Validators.required]],
      email: [this.prestataire ? this.prestataire.email : 'parigo@gmail.com', [Validators.required]],
      pays: [this.prestataire ? this.prestataire.pays : 'Cameroun', [Validators.required]],
      ville: [this.prestataire ? this.prestataire.ville : 'Yaoundé', [Validators.required]],
      lieu: [this.prestataire ? this.prestataire.localisation : 'Etoa meki, Yaoundé', [Validators.required]],
      tel: [this.prestataire ? this.prestataire.tel : '696543495', [Validators.required]],
      type: [this.prestataire && this.prestataire.hotel ? 'hotel' : 'villa', [Validators.required]],
      passe: ['0', [Validators.required]],
      confirm: ['0', [Validators.required]],
      notation: [this.prestataire ? this.prestataire.notation : '3', [Validators.required]],
      piscine: [this.prestataire && this.prestataire.options && this.prestataire.options.piscine ? true : false],
      plage: [this.prestataire && this.prestataire.options && this.prestataire.options.plage ? true : false],
      spa: [this.prestataire && this.prestataire.options && this.prestataire.options.spa ? true : false],
      petitdej: [this.prestataire && this.prestataire.options && this.prestataire.options.petitdej ? true : false],
      dej: [this.prestataire && this.prestataire.options && this.prestataire.options.dej ? true : false],
      cuisine: [this.prestataire && this.prestataire.options && this.prestataire.options.cuisine ? true : false],
    });
    this.form.controls.type.valueChanges.subscribe((val) => {
      console.log('val');
      console.log(val);
      if (val === 'hotel') {
        this.hotel = true;
      }
    });
  }

  onFormSubmit() {
    const value = this.form.value;

    const nom = value.nom;
    const description = value.description;
    const email = value.email;
    const lieu = value.lieu;
    const pays = value.pays;
    const ville = value.ville;
    const tel = value.tel;
    const notation = value.notation;
    const passe = value.passe;
    const type = value.type;
    const confirmer = value.confirm;

    if (true) {
      if (passe === confirmer) {
        let prestataire = new Utilisateur();
        if (this.prestataire) {
          prestataire = this.prestataire;
          prestataire.options = {
            piscine: false,
            plage: false,
            spa: false,
            petitdej: false,
            dej: false,
            cuisine: false,
          };
        }

        // Options
        prestataire.options.piscine = value.piscine ? true : false;
        prestataire.options.plage = value.plage ? true : false;
        prestataire.options.spa = value.spa ? true : false;
        prestataire.options.petitdej = value.petitdej ? true : false;
        prestataire.options.dej = value.dej ? true : false;
        prestataire.options.cuisine = value.cuisine ? true : false;

        prestataire.nom = nom;
        prestataire.description = description;
        prestataire.email = email;
        prestataire.localisation = lieu;
        prestataire.pays = pays;
        prestataire.ville = ville;
        prestataire.tel = tel;
        // prestataire.passe = passe;
        prestataire.notation = notation;
        if (type === 'hotel') {
          prestataire.hotel = true;
          prestataire.villa = false;
        } else {
          prestataire.hotel = false;
          prestataire.villa = true;
        }
        prestataire.prestataire = true;

        if (this.prestataire) {
          this.save(prestataire);
        } else {
          const auth = firebase.auth();
          auth.createUserWithEmailAndPassword(email, passe).then((user) => {
            prestataire.id = user.user.uid;
            this.save(prestataire);
          });
        }

      } else {
        alert('les mots de passe ne sont pas identiques !');
      }
    }
  }

  save(prestataire: Utilisateur) {

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    this.saveImage().then((liens) => {
      console.log('liens');
      console.log(liens);
      if (liens.length > 0) {
        prestataire.photoURL = liens[0];
      }
      console.log('prestataire');
      console.log(prestataire);
      const db = firebase.firestore();
      db.collection('utilisateurs-trap').doc(prestataire.id).set(JSON.parse(JSON.stringify(prestataire))).then(() => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['prestataire']);
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

  saveImage(): Promise<Array<string>> {
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

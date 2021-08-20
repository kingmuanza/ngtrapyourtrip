import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Hebergement } from 'src/app/models/hebergement.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
declare const metro: any;

@Component({
  selector: 'app-hebergement-list',
  templateUrl: './hebergement-list.component.html',
  styleUrls: ['./hebergement-list.component.scss']
})
export class HebergementListComponent implements OnInit {

  hebergements = new Array<Hebergement>();
  HEBERGEMENTS = new Array<Hebergement>();
  resultats = new Array<Hebergement>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';
  prestataire: Utilisateur;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      this.getSejours(id);
      this.getPrestataire(id);
    });
    this.initForm();
  }

  setIndisponible() {
    this.prestataire.indisponible = true;
    const db = firebase.firestore();
    db.collection('utilisateurs-trap').doc(this.prestataire.id)
      .set(JSON.parse(JSON.stringify(this.prestataire))).then(() => {
        this.router.navigate(['offres', 'hebergement']);
      });
  }

  setDisponible() {
    this.prestataire.indisponible = false;
    const db = firebase.firestore();
    db.collection('utilisateurs-trap').doc(this.prestataire.id)
      .set(JSON.parse(JSON.stringify(this.prestataire))).then(() => {
        this.router.navigate(['offres', 'hebergement']);
      });
  }

  initForm() {
    this.form = this.formBuilder.group({
      mot: ['', []],
      nature: ['null', []],
      adultes: [1, []],
      enfants: [0, []],
      ordre: ['croissant'],

      baignoire: [false],
      wifi: [false],
      climatiseur: [false],
      bureau: [false],
      linge: [false],
      tele: [false],
      insonore: [false],
      bouilloire: [false],
      cafe: [false],
      minibar: [false],
      litsimple: [false],
      litdouble: [false],
      spa: [false],
      forme: [false],
      navette: [false],
    });
    this.form.valueChanges.subscribe((val) => {
      this.onSubmitForm();
      this.changerOrdre(val.ordre);
    });
  }

  onSubmitForm() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    this.resultats = this.hebergements;
    if (value.mot) {
      this.resultats = this.rechercher(value.mot);
    }

    this.resultats = this.resultats.filter((hebergement) => {
      if (hebergement.options) {
        const baignoire = value.parking ? hebergement.options.baignoire : true;
        const wifi = value.wifi ? hebergement.options.wifi : true;
        const climatiseur = value.climatiseur ? hebergement.options.climatiseur : true;
        const bureau = value.climatiseur ? hebergement.options.bureau : true;
        const linge = value.climatiseur ? hebergement.options.linge : true;
        const tele = value.plage ? hebergement.options.tele : true;
        const insonore = value.plage ? hebergement.options.insonore : true;
        const bouilloire = value.piscine ? hebergement.options.bouilloire : true;
        const cafe = value.piscine ? hebergement.options.cafe : true;
        const minibar = value.petitdej ? hebergement.options.minibar : true;
        const litsimple = value.gardien ? hebergement.options.litsimple : true;
        const litdouble = value.gardien ? hebergement.options.litdouble : true;
        const spa = value.gardien ? hebergement.options.spa : true;
        const forme = value.gardien ? hebergement.options.forme : true;
        const navette = value.gardien ? hebergement.options.navette : true;

        const nouveaux = navette && forme && spa && cafe && insonore && linge && bureau;
        return nouveaux && wifi && baignoire && tele && bouilloire && climatiseur && minibar && litsimple && litdouble;

      } else {
        const wifi = value.wifi ? hebergement.wifi : true;
        const parking = value.parking ? hebergement.parking : true;
        return wifi && parking;
      }
    });

  }

  ouvrir(id) {
    this.router.navigate(['hebergement', 'view', id]);
  }

  getPrestataire(id: string) {
    const db = firebase.firestore();
    db.collection('utilisateurs-trap').doc(id).get().then((resultat) => {
      const prestataire = resultat.data() as Utilisateur;
      this.prestataire = prestataire;
    });
  }

  getSejours(id: string) {
    this.hebergements = new Array<Hebergement>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').where('prestataire.id', '==', id)
        .get().then((resultats) => {
          resultats.forEach((resultat) => {
            let hebergement = resultat.data() as Hebergement;
            hebergement = new Hebergement(hebergement);
            /*if (!hebergement.options) {
              hebergement.options = {
                wifi: false,
                plage: false,
                piscine: false,
                climatiseur: false,
                parking: false,
                petitdej: false,
                gardien: false,
              };
            }
            */
            this.hebergements.push(hebergement);
            this.resultats.push(hebergement);
          });
          console.log('TERMINEEE !!!');
          console.log(this.hebergements);
          metro().activity.close(activity);
          this.ordonner(this.ordre);
          resolve(this.hebergements);
        }).catch((e) => {
          metro().activity.close(activity);
          reject(e);
        });
    });
  }

  rechercher(mot: string) {
    return this.resultats.filter((sejour) => {
      const description = sejour.description.toLowerCase().indexOf(mot.toLowerCase()) !== -1;
      const titre = sejour.titre.toLowerCase().indexOf(mot.toLowerCase()) !== -1;
      return titre || description;

    });
  }

  changerOrdre(ordre) {
    this.ordre = ordre;
    this.ordonner(ordre);
  }

  ordonner(ev) {
    console.log(ev);
    if (ev === 'croissant') {
      this.resultats.sort((a, b) => {
        return a.nuitee - b.nuitee > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.nuitee - b.nuitee > 0 ? -1 : 1;
      });
    }
  }

  notationToStars(notation: number) {
    notation = Math.floor(notation);
    let stars = '';
    for (let i = 0; i < notation; i++) {
      stars = stars + '<span class="mif-star-full" style="color: rgb(48, 164, 221);"></span>';
    }
    for (let j = 0; j < 5 - notation; j++) {
      stars = stars + '<span class="mif-star-empty" style="color: rgb(48, 164, 221);"></span>';
    }
    return stars;
  }

  goToAll() {
    this.router.navigate(['offres', 'hebergement']);
  }

  modifier(prestataire) {
    this.router.navigate(['prestataire', 'edit', prestataire.id]);
  }

  nouveau(prestataire) {
    this.router.navigate(['hebergement', 'edit']);
  }

  supprimer(element) {
    let message = 'Etes vous sûr de vouloir supprimer cet élément ?';
    message = message + ' Les hébergements qu\'il fournit seront aussi supprimés !';
    const oui = confirm(message);
    if (oui) {
      const db = firebase.firestore();
      db.collection('utilisateurs-trap').doc(element.id).delete().then(() => {
        console.log('Hotel supprimé');
        db.collection('hebergements-trap').where('prestataire.id', '==', element.id).get().then((resultats) => {
          console.log('hebergements de hotel vus');
          resultats.forEach((resultat) => {
            const id = resultat.id;
            console.log(id);
            db.collection('hebergements-trap').doc(id).delete().then(() => {
              console.log('Hebrgement supprimé');
            });
          });
        });
        this.router.navigate(['offres', 'hebergement']);
      });
    }
  }

}

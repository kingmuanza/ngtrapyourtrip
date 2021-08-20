import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
declare const metro: any;

@Component({
  selector: 'app-sejour-view',
  templateUrl: './sejour-view.component.html',
  styleUrls: ['./sejour-view.component.scss']
})
export class SejourViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;

  sejour: Sejour;
  form: FormGroup;
  optionsVisibles = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id).then((sejour) => {
          this.sejour = sejour;
          setTimeout(() => {
            this.optionsVisibles = true;
          }, 1000);
          this.initForm();
        });
      }
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      relaxation: [this.sejour ? this.sejour.options['relaxation'] : false],
      pieds: [this.sejour ? this.sejour.options['pieds'] : false],
      phasenature: [this.sejour ? this.sejour.options['phasenature'] : false],
      sportif: [this.sejour ? this.sejour.options['sportif'] : false],
      gastronomique: [this.sejour ? this.sejour.options['gastronomique'] : false],
      insolite: [this.sejour ? this.sejour.options['insolite'] : false],
      festive: [this.sejour ? this.sejour.options['festive'] : false],
      affaire: [this.sejour ? this.sejour.options['affaire'] : false],
      culturel: [this.sejour ? this.sejour.options['culturel'] : false],
      animaux: [this.sejour ? this.sejour.options['animaux'] : false],

      spa: [this.sejour ? this.sejour.options['spa'] : false],
      soin: [this.sejour ? this.sejour.options['soin'] : false],
      massage: [this.sejour ? this.sejour.options['massage'] : false],

      pension: [this.sejour ? this.sejour.options['pension'] : false],
      diner: [this.sejour ? this.sejour.options['diner'] : false],
      degustation: [this.sejour ? this.sejour.options['degustation'] : false],
      pensioncomplete: [this.sejour ? this.sejour.options['pensioncomplete'] : false],

      visiteguidee: [this.sejour ? this.sejour.options['visiteguidee'] : false],
      autresvisites: [this.sejour ? this.sejour.options['autresvisites'] : false],

      golf: [this.sejour ? this.sejour.options['golf'] : false],
      sallesport: [this.sejour ? this.sejour.options['sallesport'] : false],
      velo: [this.sejour ? this.sejour.options['velo'] : false],
      tennis: [this.sejour ? this.sejour.options['tennis'] : false],
      basket: [this.sejour ? this.sejour.options['basket'] : false],

      ponctuel: [this.sejour ? this.sejour.options['ponctuel'] : false],
      attraction: [this.sejour ? this.sejour.options['attraction'] : false],
      spectacle: [this.sejour ? this.sejour.options['spectacle'] : false],
      zoo: [this.sejour ? this.sejour.options['zoo'] : false],
      foire: [this.sejour ? this.sejour.options['foire'] : false],
      randonnee: [this.sejour ? this.sejour.options['randonnee'] : false],

      maisonvacances: [this.sejour ? this.sejour.options['maisonvacances'] : false],
      appartementvacances: [this.sejour ? this.sejour.options['appartementvacances'] : false],
      chambrehotel: [this.sejour ? this.sejour.options['chambrehotel'] : false],
      villagevacances: [this.sejour ? this.sejour.options['villagevacances'] : false],

      hotel: [this.sejour ? this.sejour.options['hotel'] : false],
      pointrencontre: [this.sejour ? this.sejour.options['pointrencontre'] : false],
      lieuactivite: [this.sejour ? this.sejour.options['lieuactivite'] : false],

      francais: [this.sejour ? this.sejour.options['francais'] : false],
      anglais: [this.sejour ? this.sejour.options['anglais'] : false],
      arabe: [this.sejour ? this.sejour.options['arabe'] : false],

    });

  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const personnes = value.personnes;
    const date = this.calendarpickerlocale.nativeElement.value;
    if (date && date.length > 2) {

      const reservation = new Reservation();
      reservation.sejour = this.sejour;
      reservation.personnes = personnes;
      reservation.dateDebut = new Date(this.sejour.dateDebut);
      reservation.dateFin = new Date(this.sejour.dateFin);
      reservation.cout = this.sejour.prixUnitaire * personnes;

      console.log('reservation');
      console.log(reservation);

      const activity = metro().activity.open({
        type: 'square',
        overlayColor: '#fff',
        overlayAlpha: 0.8
      });

      const panierString = localStorage.getItem('panier-trap');
      let panier = [];
      if (panierString) {
        panier = JSON.parse(panierString);
      }
      panier.push(reservation);
      localStorage.setItem('panier-trap', JSON.stringify(panier));

      const db = firebase.firestore();
      db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation))).then((resultats) => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
      }).catch((e) => {
        metro().activity.close(activity);
      });

    } else {
      const notify = metro().notify;
      notify.create('Veuillez renseigner la date', null, {
        cls: 'alert',
        keepOpen: true
      });
    }

  }

  getSejour(id: string): Promise<Sejour> {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('sejours-trap').doc(id).get().then((resultat) => {
        const sejour = resultat.data() as Sejour;
        this.sejour = sejour;
        console.log('TERMINEEE !!!');
        console.log(this.sejour);
        metro().activity.close(activity);
        resolve(sejour);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
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
    this.router.navigate(['offres', 'sejour']);
  }

  modifier(sejour) {
    this.router.navigate(['offres', 'sejour', 'edit', sejour.id]);
  }

  supprimer(element) {
    const oui = confirm('Etes vous sûr de vouloir supprimer ce jour ?');
    const db = firebase.firestore();
    if (oui) {
      db.collection('sejours-trap').doc(element.id).delete().then(() => {
        this.router.navigate(['offres', 'sejour']);
      });
    }
  }

  voirDivertissement(d) {
    this.router.navigate(['offres', 'divertissement', 'evenements', 'view', d.id]);
  }

}

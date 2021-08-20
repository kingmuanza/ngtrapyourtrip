import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trap';

  constructor(private authService: AdminService) {
    const FIREBASE_CONFIG = {
      apiKey: 'AIzaSyD6j-e5lYO_vfM2_PDt5Fr2tXInMEztwA4',
      authDomain: 'trapyourtrip.firebaseapp.com',
      databaseURL: 'https://trapyourtrip.firebaseio.com',
      projectId: 'trapyourtrip',
      storageBucket: 'trapyourtrip.appspot.com',
      messagingSenderId: '339042367276',
      appId: '1:339042367276:web:c0367f5a67aec947301e89'
    };
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  ngOnInit(): void {
    const utilisateurString = localStorage.getItem('trap-your-admin');
    if (utilisateurString) {
      console.log('administrateur trouvé... Auto connexion');
      try {

        const administrateur = JSON.parse(utilisateurString);
        this.authService.administrateur = administrateur;
        this.authService.emit();
      } catch (e) {
        localStorage.removeItem('trap-your-admin');
      }
    }

    this.getPosition().then((pos) => {
      console.log('Cooedronnéesn géographies');
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
    });
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition((resp) => {

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        (err) => {
          reject(err);
        });
    });

  }
}

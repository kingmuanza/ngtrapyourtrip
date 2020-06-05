import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trap';

  constructor() {
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
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { SejourViewComponent } from './pages/sejour/sejour-view/sejour-view.component';
// tslint:disable-next-line:ordered-imports
import { SejourListComponent } from './pages/sejour/sejour-list/sejour-list.component';
import { SejourEditComponent } from './pages/sejour/sejour-edit/sejour-edit.component';
import { RechercherComponent } from './pages/rechercher/rechercher.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminConnexionComponent } from './pages/administration/admin-connexion/admin-connexion.component';
import { ConsoleComponent } from './pages/administration/console/console.component';
import { PanierComponent } from './pages/panier/panier.component';
import { PaiementListComponent } from './pages/paiement/paiement-list/paiement-list.component';
import { PaiementEditComponent } from './pages/paiement/paiement-edit/paiement-edit.component';
import { PaiementViewComponent } from './pages/paiement/paiement-view/paiement-view.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { HebergementListComponent } from './pages/hebergement/hebergement-list/hebergement-list.component';
import { HebergementViewComponent } from './pages/hebergement/hebergement-view/hebergement-view.component';
import { HebergementEditComponent } from './pages/hebergement/hebergement-edit/hebergement-edit.component';
import { DivertissementEditComponent } from './pages/divertissement/divertissement-edit/divertissement-edit.component';
import { DivertissementViewComponent } from './pages/divertissement/divertissement-view/divertissement-view.component';
import { DivertissementListComponent } from './pages/divertissement/divertissement-list/divertissement-list.component';
import { TransportListComponent } from './pages/transport/transport-list/transport-list.component';
import { TransportEditComponent } from './pages/transport/transport-edit/transport-edit.component';
import { TransportViewComponent } from './pages/transport/transport-view/transport-view.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },

  { path: 'rechercher', component: RechercherComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion', component: ConnexionComponent },

  { path: 'dashboard/paiement', component: PaiementListComponent },
  { path: 'dashboard/paiement/edit', component: PaiementEditComponent },
  { path: 'dashboard/paiement/view/:id', component: PaiementViewComponent },

  { path: 'admin/connexion', component: AdminConnexionComponent },
  { path: 'admin/console', component: ConsoleComponent },

  { path: 'sejour', component: SejourListComponent },
  { path: 'sejour/view/:id', component: SejourViewComponent },
  { path: 'sejour/edit', component: SejourEditComponent },
  { path: 'sejour/edit/:id', component: SejourEditComponent },

  { path: 'hebergement', component: HebergementListComponent },
  { path: 'hebergement/view/:id', component: HebergementViewComponent },
  { path: 'hebergement/edit', component: HebergementEditComponent },
  { path: 'hebergement/edit/:id', component: HebergementEditComponent },

  { path: 'divertissement', component: DivertissementListComponent },
  { path: 'divertissement/view/:id', component: DivertissementViewComponent },
  { path: 'divertissement/edit', component: DivertissementEditComponent },
  { path: 'divertissement/edit/:id', component: DivertissementEditComponent },

  { path: 'transport', component: TransportListComponent },
  { path: 'transport/view/:id', component: TransportViewComponent },
  { path: 'transport/edit', component: TransportEditComponent },
  { path: 'transport/edit/:id', component: TransportEditComponent },

  { path: 'accueil', component: AccueilComponent },
  { path: '**', redirectTo: 'accueil' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

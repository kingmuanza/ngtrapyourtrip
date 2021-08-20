import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Administrateur } from 'src/app/models/administrateur.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  administrateur: Administrateur;
  administrateurSubscription: Subscription;
  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.administrateurSubscription = this.adminService.adminSubject.subscribe((administrateur) => {
      this.administrateur = administrateur;
    });
    this.adminService.emit();
  }

}

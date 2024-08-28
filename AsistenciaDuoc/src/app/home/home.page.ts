import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user!: string;
  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private toaster: ToastController
  ) {
    this.activeroute.queryParams.subscribe((params) => {
      let state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['user']) {
        this.user = state['user']; // Almacena el valor en la propiedad
      }
    });
  }
}

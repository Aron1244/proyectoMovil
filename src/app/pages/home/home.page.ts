import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user!: string;
  developer: String = 'ByteForge';

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private toaster: ToastController,
    private loginService: LoginService
  ) {
    this.activeroute.queryParams.subscribe((params) => {
      let state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['user']) {
        this.user = state['user']; // Almacena el valor en la propiedad
      }
    });
  }

  async logOut() {

    this.loginService.logOut();
    this.router.navigate(['/login']);

    const toast = await this.toaster.create({
      message: 'Has cerrado sesión exitosamente.',
      duration: 2000,
      position: 'top',
      color: 'secondary',
    });
    toast.present();
  }
  
  goToUserInfo() {
    this.router.navigate(['/user-info'], {
      state: { user: this.user },
    });
  }

  async leerQr() {
    const toast = await this.toaster.create({
      message: 'Leer código QR',
      duration: 2000,
      position: 'middle',
      color: 'primary',
      icon: 'qr-code-outline',
    });

    toast.present();
  }
}

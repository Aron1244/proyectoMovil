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
  developer: String = 'ByteForge';

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

  async logOut() {
    // Aquí puedes agregar la lógica para el cierre de sesión (por ejemplo, limpiar el almacenamiento local o el estado de la sesión)

    // Luego, redirige al usuario a la página de inicio de sesión
    await this.router.navigate(['/login']);

    // Opcional: mostrar un mensaje de éxito con un Toast
    const toast = await this.toaster.create({
      message: 'Has cerrado sesión exitosamente.',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  goToUserInfo() {
    this.router.navigate(['/user-info'], {
      state: { user: this.user },
    });
  }
}

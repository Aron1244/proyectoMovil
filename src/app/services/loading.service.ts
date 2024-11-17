import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;
  private procesosActivos = 0;

  constructor(private loadingCtrl: LoadingController) {}

  async mostrarLoading(mensaje: string = 'cargando...'){
    this.procesosActivos++;

    if (this.procesosActivos === 1 && !this.loading){
      this.loading = await this.loadingCtrl.create({
        message: mensaje,
        spinner: 'bubbles',

      });
      await this.loading.present();
    }
  }


  async ocultarLoading() {
    this.procesosActivos = Math.max(0, this.procesosActivos - 1);

    if (this.procesosActivos === 0 && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ClimateService } from 'src/app/services/climate.service';

import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
  CapacitorBarcodeScannerTypeHintALLOption,
} from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user!: string;
  developer: string = 'ByteForge';
  weatherData: any;
  loading: boolean = false; // Variable para manejar el estado de carga
  error: string | null = null; // Variable para manejar el error

  result: string = '';
  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private toaster: ToastController,
    private loginService: LoginService,
    private climateService: ClimateService
  ) {
    this.activeroute.queryParams.subscribe(async (params) => {
      let state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['user']) {
        this.user = state['user']; // Almacena el valor en la propiedad
        await this.loginService.registerLoggedUser({
          username: this.user,
          password: '',
          email: '',
          name: '',
          birth_date: '',
          career: '',
          genre: '',
          occupation: '',
          phone: '',
          student_id: 0
        }); // Almacena el usuario en el servicio de almacenamiento
      }
    });
  }

  async ngOnInit() {
    this.getWeather();
    const loggedUser = this.loginService.getLoggedUser();
    if (loggedUser) {
      this.user = loggedUser.username;
    } else {
      const storedUser = await this.loginService.getLoggedUser();
      if (storedUser) {
        this.user = storedUser.username; // Recupera el usuario del servicio de almacenamiento
      }
    }
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

  goToHistorial() {
    this.router.navigate(['/historial'], {
      state: { user: this.user },
    });
  }

  goToClases() {
    this.router.navigate(['/clases'], {
      state: { user: this.user },
    });
  }

  getWeather() {
    this.loading = true; // Indica que se está cargando
    this.error = null; // Reinicia el error al comenzar la carga

    this.climateService.getWeather().subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log(this.weatherData); // Puedes ver los datos en la consola
        this.loading = false; // Fin de la carga
      },
      error: (error) => {
        console.error('Error al obtener el clima', error);
        this.error =
          'No se pudo obtener la información del clima. Intenta nuevamente más tarde.'; // Mensaje de error
        this.loading = false; // Fin de la carga
      },
      complete: () => {
        console.log('La solicitud de clima se completó.'); // Acción cuando se completa
      },
    });
  }

  getWeatherIcon(condition: string): string {
    if (
      condition.toLowerCase().includes('sun') ||
      condition.toLowerCase().includes('clear')
    ) {
      return 'sunny-outline'; // Soleado
    } else if (condition.toLowerCase().includes('cloud')) {
      return 'cloud-outline'; // Nublado
    } else if (condition.toLowerCase().includes('rain')) {
      return 'rainy-outline'; // Lluvia
    } else if (condition.toLowerCase().includes('snow')) {
      return 'snow-outline'; // Nieve
    } else if (condition.toLowerCase().includes('storm')) {
      return 'thunderstorm-outline'; // Tormenta
    } else {
      return 'partly-sunny-outline'; // Clima mixto o desconocido
    }
  }

  async leerQr(): Promise<void> {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL,
    });

    this.result = result.ScanResult;
  }
}

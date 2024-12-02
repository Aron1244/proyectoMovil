import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ClimateService } from 'src/app/services/climate.service';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { FirestoreService } from 'src/app/services/firestore.service';
import { LoadingService } from 'src/app/services/loading.service';
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

  // Coordenadas de la ubicación objetivo
  private targetLatitude = -33.44966139614493;
  private targetLongitude = -70.6945602164515;
  private distanceThreshold = 2000;
  private deviceLatitude!: number;
  private deviceLongitude!: number;

  result: string = '';
  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private toaster: ToastController,
    private loginService: LoginService,
    private climateService: ClimateService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
    private loadingService: LoadingService,
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
          student_id: 0,
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
    try {
      await this.loadingService.mostrarLoading();
      const coordinates = await Geolocation.getCurrentPosition();
      this.deviceLatitude = coordinates.coords.latitude;
      this.deviceLongitude = coordinates.coords.longitude;
      const currentLatitude = coordinates.coords.latitude;
      const currentLongitude = coordinates.coords.longitude;

      console.log('Coordenadas obtenidas: ', currentLatitude, currentLongitude);

      const distance = this.calculateDistance(
        this.deviceLatitude,
        this.deviceLongitude,
        this.targetLatitude,
        this.targetLongitude
      );

      console.log('Distancia calculada:', distance);

      if (distance <= this.distanceThreshold) {
        const result = await CapacitorBarcodeScanner.scanBarcode({
          hint: CapacitorBarcodeScannerTypeHint.ALL,
        });
        this.result = result.ScanResult;

        const [asignatura, seccion, sala, fecha] = this.result.split('|');
        console.log('Datos del QR:', { asignatura, seccion, sala, fecha });

        await this.verificarYRegistrarAsistencia(asignatura, fecha);
      } else {
        const toast = await this.toaster.create({
          message: `Estás demasiado lejos para escanear el código QR. Distancia: ${distance.toFixed(2)} m.`,
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error obteniendo la ubicación o procesando el QR', error);
      const toast = await this.toaster.create({
        message: 'Ocurrió un error al procesar tu asistencia.',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
    } finally {
      await this.loadingService.ocultarLoading();
    }
  }


  // Función para calcular la distancia en metros entre dos puntos de latitud/longitud
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadius = 6371; // Radio de la tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c * 1000; // Convertir a metros
    console.log('Distancia calculada:', distance);
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async verificarYRegistrarAsistencia(asignatura: string, fecha: string): Promise<void> {
    try {
      const asistencia = await this.firestoreService.getAsistencia(this.user, asignatura, fecha);

      if (asistencia) {
        if (asistencia.presente) {
          const toast = await this.toaster.create({
            message: 'Ya estás registrado como presente.',
            duration: 3000,
            position: 'top',
            color: 'warning',
          });
          toast.present();
        } else {
          await this.firestoreService.actualizarAsistencia(asistencia.id, { presente: true });
          const toast = await this.toaster.create({
            message: 'Asistencia registrada exitosamente.',
            duration: 3000,
            position: 'top',
            color: 'success',
          });
          toast.present();
        }
      } else {
        await this.firestoreService.crearAsistencia({
          username: this.user,
          asignatura,
          fecha,
          presente: true,
        });
        const toast = await this.toaster.create({
          message: 'Asistencia registrada exitosamente.',
          duration: 3000,
          position: 'top',
          color: 'success',
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      const toast = await this.toaster.create({
        message: 'Error al registrar la asistencia. Intenta nuevamente.',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
    }
  }

}

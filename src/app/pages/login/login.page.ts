import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from './../../services/login.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username!: string;
  password!: string;
  developer: string = 'ByteForge';
  message: string;
  isPasswordVisible: boolean = false;

  constructor(
    private router: Router,
    private toaster: ToastController,
    private loginService: LoginService,
    private loadingService: LoadingService,
  ) {
    this.message = 'Bienvenido' + this.username;
  }

  ngOnInit() {}

  async validateLogin() {
    try {
      console.log('Validando usuario');

      await this.loadingService.mostrarLoading('Iniciando sesión...');
      const login = await this.loginService.findByUsername(this.username);

      if (login === undefined) {
        this.generateMessage('Usuario no existe', 'danger');
        return;
      }

      if (this.username === login.username && this.password === login.password) {
        this.generateMessage('Login correcto', 'success');
        this.loginService.registerLoggedUser(login);

        let extras: NavigationExtras = {
          state: { user: this.username },
        };
        this.router.navigate(['/home'], extras);
      } else {
        this.generateMessage('Login fallido', 'danger');
      }
    } catch (error) {
      console.error('Error en la validación del usuario:', error);
      this.generateMessage('Error en el proceso de inicio de sesión', 'danger');
    } finally {
      // Ocultar el Loading siempre, incluso si hubo algún error
      await this.loadingService.ocultarLoading();
    }
  }

  async generateMessage(message: string, color: string) {
    const toast = await this.toaster.create({
      message: message,
      duration: 500,
      position: 'top',
      color: color,
    });
    await toast.present();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}

import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username!: String;
  password!: String;
  developer: String = 'ByteForge';
  message: String;

  constructor(
    private router: Router,
    private toaster: ToastController,
    private loginService: LoginService
  ) {
    this.message = 'Bienvenido' + this.username;
  }

  ngOnInit() {}

  validateLogin() {
    console.log('Validando usuario');

    const login = this.loginService.findByUsername(this.username);

    if (login === undefined) {
      this.generateMessage('Usuario no existe', 'danger');
      return;
    }

    if(this.username === login.username && this.password === login.password){
      this.generateMessage('Login correcto', 'success');
      this.loginService.registerLoggedUser(login);
      let extras: NavigationExtras ={
        state: {user: this.username}
      }
      this.router.navigate(['/home'],extras);
    } else {
      this.generateMessage('Login fallido', 'danger')
    } 
  }

  async generateMessage(message: string, color: string){
    const toast = await this.toaster.create({
      message: message,
      duration: 500,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}

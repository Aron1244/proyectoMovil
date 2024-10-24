import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { Login } from '../../models/login';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  user!: string;
  email!: string;
  name!: string;
  birth_date!: Date;
  career!: string;
  genre!: string;
  occupation!: string;
  phone!: string;
  student_id!: number;

  developer: string = 'ByteForge';

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    console.log('UserInfoPage constructor called');
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user?: string };
    if (state && state.user) {
      this.user = state.user;
      console.log('Usuario recibido:', this.user);
    } else {
      console.error('No se encontró el estado del usuario');
    }
  }

  ngOnInit() {
    if (this.user) {
      this.loadUserData(this.user);
    }
  }

  async loadUserData(username: string) {
    console.log(`Cargando datos para el usuario: ${username}`);
    const userData = await this.firestoreService.getData(username);
    console.log('Datos del usuario:', userData);
    if (userData) {
      this.email = userData.email;
      this.name = userData.name;

      // Verifica si birth_date es un objeto y si tiene el método toDate
      if (
        userData.birth_date &&
        typeof userData.birth_date === 'object' &&
        'toDate' in userData.birth_date
      ) {
        this.birth_date = (userData.birth_date as Timestamp).toDate();
      } else {
        console.error('Formato de birth_date no válido:', userData.birth_date);
        this.birth_date = new Date(); // O asigna una fecha predeterminada
      }

      this.career = userData.career;
      this.genre = userData.genre;
      this.occupation = userData.occupation;
      this.phone = userData.phone;
      this.student_id = userData.student_id;
    } else {
      console.log('No se encontraron los datos del usuario');
      this.email = 'No data found';
    }
  }
}

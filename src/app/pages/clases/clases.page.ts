import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Asignatura } from 'src/app/models/asignatura';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
})
export class ClasesPage implements OnInit {
  developer: String = 'ByteForge';
  user!: string;
  email!: string;
  name!: string;
  birth_date!: Date;
  career!: string;
  genre!: string;
  occupation!: string;
  phone!: string;
  student_id!: number;

  asignaturas: Asignatura[] = [];
  asignaturasPorDia: { [key: string]: Asignatura[] } = {};
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];  // Días de la semana

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
    this.loadAsignaturas();
  }

  async loadUserData(username: string) {
    try {
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
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      this.email = 'Error loading data';
    }
  }

  async loadAsignaturas() {
    try {
      const asignaturas = await this.firestoreService.getAsignaturas();
      this.asignaturas = asignaturas;

      // Agrupar las asignaturas por día
      this.asignaturasPorDia = this.groupAsignaturasByDay(asignaturas);
    } catch (error) {
      console.error('Error al cargar las asignaturas', error);
    }
  }

  groupAsignaturasByDay(asignaturas: Asignatura[]): { [key: string]: Asignatura[] } {
    return asignaturas.reduce((acc: { [key: string]: Asignatura[] }, asignatura) => {
      const dia = asignatura.dia;  // Día de la asignatura
      if (!acc[dia]) {
        acc[dia] = [];
      }
      acc[dia].push(asignatura);
      return acc;
    }, {});
  }

  formatHora(timestamp: Timestamp): string {
    const date = timestamp.toDate();  // Convertir el Timestamp a Date
    const hours = date.getHours();     // Obtener las horas
    const minutes = date.getMinutes(); // Obtener los minutos
    
    // Formatear como HH:mm (con dos dígitos)
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
}

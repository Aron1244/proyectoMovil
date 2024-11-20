import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
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

  asignaturas: any[] = [];  // Lista de asignaturas
  asistencias: any[] = [];  // Lista de asistencias
  historial: { [key: string]: { clasesRegistradas: number, clasesAsistidas: number } } = {};


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
    this.loadAsistencias();
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
          console.error(
            'Formato de birth_date no válido:',
            userData.birth_date
          );
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
      this.asignaturas = await this.firestoreService.getAsignaturas();
      console.log('Asignaturas:', this.asignaturas);
    } catch (error) {
      console.error('Error al cargar las asignaturas', error);
    }
  }

  async loadAsistencias() {
    try {
      this.asistencias = await this.firestoreService.getAsistencias(this.user);
      console.log('Asistencias:', this.asistencias);  // Revisa la estructura de los datos
      this.groupAsistencias();
    } catch (error) {
      console.error('Error al cargar las asistencias', error);
    }
  }
  
  
  groupAsistencias() {
    this.asistencias.forEach(asistencia => {
      const asignatura = asistencia.asignatura;
  
      // Verifica si ya existe una entrada en 'historial' para esta asignatura
      if (!this.historial[asignatura]) {
        // Si no existe, inicializa el objeto
        this.historial[asignatura] = { clasesRegistradas: 0, clasesAsistidas: 0 };
      }
  
      // Asegúrate de que el objeto 'historial[asignatura]' esté definido antes de acceder a sus propiedades
      if (this.historial[asignatura]) {
        // Sumar una clase registrada para la asignatura
        this.historial[asignatura].clasesRegistradas += 1;
  
        // Si 'presente' es true, sumar una clase asistida
        if (asistencia.presente === true) {
          this.historial[asignatura].clasesAsistidas += 1;
        }
      } else {
        console.error(`Historial no definido para la asignatura: ${asignatura}`);
      }
    });
  
    console.log(this.historial);  // Verifica que 'historial' se está actualizando correctamente
  }
  

  getClasesRegistradas(asignaturaNombre: string): number {
    return this.historial[asignaturaNombre]?.clasesRegistradas || 0;
  }
  
  getClasesAsistidas(asignaturaNombre: string): number {
    return this.historial[asignaturaNombre]?.clasesAsistidas || 0;
  }
  
  
}

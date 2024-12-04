import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { LoadingService } from 'src/app/services/loading.service';

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

  asignaturas: any[] = []; // Lista de asignaturas
  asistencias: any[] = []; // Lista de asistencias
  historial: {
    [key: string]: { clasesRegistradas: number; clasesAsistidas: number };
  } = {};

  totalClasesAsistidas: number = 0;
  totalClasesRegistradas: number = 0;
  totalClasesFaltantes: number = 0;

  listaClasesAsistidas: any[] = [];
  listaClasesFaltantes: any[] = [];

  constructor(
    private router: Router,
    private firestoreService: FirestoreService,
    private loadingService: LoadingService
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
      await this.loadingService.mostrarLoading();
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
    } finally {
      await this.loadingService.ocultarLoading();
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
      console.log('Asistencias:', this.asistencias); // Revisa la estructura de los datos
      this.groupAsistencias();
    } catch (error) {
      console.error('Error al cargar las asistencias', error);
    }
  }

  groupAsistencias() {
    this.totalClasesAsistidas = 0;
    this.totalClasesRegistradas = 0;
    this.totalClasesFaltantes = 0;

    this.listaClasesAsistidas = [];
    this.listaClasesFaltantes = [];

    this.asistencias.forEach((asistencia) => {
      const asignatura = asistencia.asignatura;
      this.totalClasesRegistradas += 1;
      if (!this.historial[asignatura]) {
        this.historial[asignatura] = {
          clasesRegistradas: 0,
          clasesAsistidas: 0,
        };
      }
      if (this.historial[asignatura]) {
        this.historial[asignatura].clasesRegistradas += 1;
        if (asistencia.presente === true) {
          this.historial[asignatura].clasesAsistidas += 1;
          this.totalClasesAsistidas += 1;
          this.listaClasesAsistidas.push(asistencia);
        } else {
          this.listaClasesFaltantes.push(asistencia);
        }
      }
    });

    this.totalClasesFaltantes =
      this.totalClasesRegistradas - this.totalClasesAsistidas;

    console.log('Clases Asistidas:', this.listaClasesAsistidas);
    console.log('Clases Faltantes:', this.listaClasesFaltantes);

    // Forzar que los cambios se detecten
    setTimeout(() => {
      console.log('Detección de cambios forzada');
    }, 0);
  }
}

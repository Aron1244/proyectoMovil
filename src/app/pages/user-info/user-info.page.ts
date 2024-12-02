import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { Login } from '../../models/login';
import { Timestamp } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  editMode: boolean = false;
  userForm!: FormGroup;
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
    private firestoreService: FirestoreService,
    private formbuild: FormBuilder,
    private loadingService: LoadingService,
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
    this.userForm = this.formbuild.group({
      email: ['', [Validators.required, Validators.email]],
      genre: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      name: ['', Validators.required]
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && this.userForm && this.user) {
      // Poblar el formulario con datos actuales cuando se activa el modo de edición
      this.userForm.patchValue({
        email: this.email,
        genre: this.genre,
        phone: this.phone,
        name: this.name,

      } );
    }
  }

  async saveChanges() {
    if (this.userForm.valid) {
      const updatedData = this.userForm.value;
      try {

        await this.loadingService.mostrarLoading('Guardando Datos...');
        // Aquí debes asegurarte de que tienes el `userId` correcto
        await this.firestoreService.updateUser(this.user, updatedData);
        console.log('Datos guardados exitosamente');
        this.toggleEditMode(); // Salir del modo de edición

        // Recargar la página usando el Router
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.router.url]);
      });

      } catch (error) {
        console.error('Error al guardar los datos:', error);
      }finally{
        await this.loadingService.ocultarLoading();
      }
    } else {
      console.warn('Formulario inválido, revisa los datos ingresados.');
    }
  }

  async loadUserData(username: string) {
    console.log(`Cargando datos para el usuario: ${username}`);
    const userData = await this.firestoreService.getData(username);
    console.log('Datos del usuario:', userData);
    if (userData) {
      this.email = userData.email;
      this.name = userData.name;
      this.userForm.patchValue(userData);

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

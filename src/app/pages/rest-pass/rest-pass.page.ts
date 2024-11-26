import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Login } from 'src/app/models/login';
import { StorageService } from 'src/app/services/storage.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rest-pass',
  templateUrl: './rest-pass.page.html',
  styleUrls: ['./rest-pass.page.scss'],
})
export class RestPassPage implements OnInit {

  developer: String = 'ByteForge'
  correo!: string;
  alertButtons = ['Aceptar'] ;
  password!: String;


  constructor(
    private firestore: Firestore,
    private loading: LoadingService,
    private alertController: AlertController,
    private router: Router,
  ) { }





  ngOnInit() {

  }

  async buscarUserPorCorreo(email: string): Promise<Login | undefined> {
    const userRef = collection(this.firestore, 'users');
    const q = query(userRef, where('email', '==', email)); // Busca por email en lugar de username
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return undefined;
    }

    const userData = snapshot.docs[0].data();
    return {
      email: userData['email'],
      username: userData['username'],
      password: userData['password'],

      name: userData['name'],
      birth_date: userData['birth_date'],
      career: userData['career'],
      genre: userData['genre'],
      occupation: userData['occupation'],
      phone: userData['phone'],
      student_id: userData['student_id'],
    };
  }



  // Método para mostrar alerta con la nueva contraseña
  async showAlertNewPassword(password: string) {
    const alert = await this.alertController.create({
      header: 'Contraseña Generada',
      message: `Tu nueva contraseña es: <strong>${password}</strong>`,
      buttons: ['Ok'],
    });

    await alert.present();
  }







  async updatePasswordByEmail(email: string): Promise<void> {
    await this.loading.mostrarLoading();
    try {
      // Buscar al usuario por su email
      const user = await this.buscarUserPorCorreo(email);
      if (user) {
        // Generar la nueva contraseña (nombre + 3 números aleatorios)
        const newPassword = user.name + Math.floor(100 + Math.random() * 900); // Generar un número aleatorio de 3 dígitos

        // Realizar la consulta para obtener el ID del documento
        const userRef = collection(this.firestore, 'users');
        const q = query(userRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // Obtener el ID del documento
          const userDocId = snapshot.docs[0].id;

          // Actualizar la contraseña usando el ID del documento
          const userRefDoc = doc(this.firestore, 'users', userDocId);
          await updateDoc(userRefDoc, { password: newPassword });

          await this.showAlertNewPassword(newPassword);
          console.log(`Contraseña actualizada para ${user.username}: ${newPassword}`);
          this.router.navigate(['/login']);

        } else {
          console.error('Usuario no encontrado con ese correo');
        }

      } else {
        console.error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
    } finally {
      await this.loading.ocultarLoading();
    }
  }


  // async buscarUser(username: string): Promise<Login | undefined> {
  //   const userRef = collection(this.firestore, 'users');
  //   const q = query(userRef, where('username', '==', username));
  //   const snapshot = await getDocs(q);
  //   if (snapshot.empty) {
  //     return undefined;
  //   }
  //   const userData = snapshot.docs[0].data();
  //   return {
  //     username: userData['username'],
  //     password: userData['password'],
  //     email: userData['email'],
  //     name: userData['name'],
  //     birth_date: userData['birth_date'],
  //     career: userData['career'],
  //     genre: userData['genre'],
  //     occupation: userData['occupation'],
  //     phone: userData['phone'],
  //     student_id: userData['student_id'],
  //   };
  // }

  // async updatePasswordByUsername(username: string): Promise<void> {
  //   await this.loading.mostrarLoading();
  //   try {
  //     // Buscar al usuario por su username

  //     const user = await this.buscarUser(username);
  //     if (user) {
  //       // Generar la nueva contraseña (nombre + 3 números aleatorios)
  //       const newPassword = user.name + Math.floor(Math.random() * 1000); // Generar un número aleatorio de 3 dígitos

  //       // Actualizar el usuario con la nueva contraseña
  //       const userRef = doc(this.firestore, 'users', user.username);
  //       await updateDoc(userRef, { password: newPassword });

  //       console.log(`Contraseña actualizada para ${user.username}: ${newPassword}`);

  //       // Aquí podrías también enviar un correo al usuario, o notificarlo de alguna manera si es necesario
  //     } else {
  //       console.error('Usuario no encontrado');
  //     }
  //   } catch (error) {
  //     console.error('Error al actualizar la contraseña:', error);
  //   } finally{
  //     await this.loading.ocultarLoading();
  //   }
  // }

}

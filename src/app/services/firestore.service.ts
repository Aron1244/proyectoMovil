import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async getData(username: string): Promise<Login | null> {
    try {
      // Referencia a la colección 'users'
      const usersCollection = collection(this.firestore, 'users');

      // Realizar una consulta donde el campo 'username' coincida con el username proporcionado
      const q = query(usersCollection, where('username', '==', username));

      // Ejecutar la consulta
      const querySnapshot: QuerySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Obtener el primer documento que coincide

        const data = userDoc.data();
        console.log('Usuario encontrado:', data);

        // Devolver los datos del usuario como un objeto Login
        return {
          username: data['username'],
          password: data['password'],
          email: data['email'],
          name: data['name'], // Incluir el campo name
          birth_date: data['birth_date'],
          career: data['career'],
          genre: data['genre'],
          occupation: data['occupation'],
          phone: data['phone'],
          student_id: data['student_id'],
        } as Login;
      } else {
        console.error('No se encontró un usuario con el username:', username);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      return null;
    }
  }
}

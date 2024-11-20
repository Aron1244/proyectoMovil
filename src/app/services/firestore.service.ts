import { Injectable } from '@angular/core';
import {
  doc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Firestore,
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

  async getAsistencia(username: string, asignatura: string, fecha: string): Promise<any | null> {
    const asistenciaRef = collection(this.firestore, 'asistencias');
    const q = query(
      asistenciaRef,
      where('username', '==', username),
      where('asignatura', '==', asignatura),
      where('fecha', '==', fecha)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  }

  async actualizarAsistencia(id: string, data: any): Promise<void> {
    const asistenciaDoc = doc(this.firestore, `asistencias/${id}`);
    await updateDoc(asistenciaDoc, data);
  }

  async crearAsistencia(data: any): Promise<void> {
    const asistenciaRef = collection(this.firestore, 'asistencias');
    await addDoc(asistenciaRef, data);
  }
}

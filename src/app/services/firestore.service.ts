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
  DocumentReference,
} from '@angular/fire/firestore';
import { Login } from '../models/login';
import { Asignatura } from '../models/asignatura';

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

  async getAsistencia(
    username: string,
    asignatura: string,
    fecha: string
  ): Promise<any | null> {
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

  async getAsignaturas(): Promise<Asignatura[]> {
    const asignaturasCollection = collection(this.firestore, 'asignaturas');
    const snapshot = await getDocs(asignaturasCollection);
    const asignaturas: Asignatura[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      asignaturas.push(
        new Asignatura(
          data['codigo'],
          data['dia'],
          data['hora'],
          data['nombre'],
          data['profesor'],
          data['sala'],
          data['seccion']
        )
      );
    });

    return asignaturas;
  }

  async getAsistencias(username: string): Promise<any[]> {
    const asistenciaRef = collection(this.firestore, 'asistencias');
    const q = query(asistenciaRef, where('username', '==', username));
    const snapshot = await getDocs(q);

    const asistencias: any[] = [];
    snapshot.forEach((doc) => {
      asistencias.push({ id: doc.id, ...doc.data() });
    });
    return asistencias;
  }

  async updateUser(
    username: string,
    updatedData: Partial<Login>
  ): Promise<void> {
    try {
      // Referencia a la colección 'users'
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('username', '==', username));

      // Ejecutar la consulta
      const querySnapshot: QuerySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Obtener el primer documento que coincide
        const userDocRef: DocumentReference = userDoc.ref; // Referencia al documento encontrado

        // Actualizar los datos en Firestore
        await updateDoc(userDocRef, updatedData);
        console.log('Datos del usuario actualizados exitosamente');
      } else {
        console.error('No se encontró un usuario con el username:', username);
      }
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
    }
  }

  async getAsignatura(codigo: string): Promise<boolean> {
    try {
      const asignaturaRef = collection(this.firestore, 'asignaturas');
      const q = query(asignaturaRef, where('codigo', '==', codigo));
      const snapshot = await getDocs(q);

      // Si hay resultados en la consulta, significa que la asignatura existe
      return !snapshot.empty;
    } catch (error) {
      console.error('Error verificando la asignatura en Firestore:', error);
      return false;
    }
  }
}

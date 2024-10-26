import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Login } from '../models/login';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loggedUser!: Login | undefined;

  constructor(private storage: StorageService, private firestore: Firestore) {
    this.init(); // Inicializa el usuario logueado
  }

  async init(): Promise<void> {
    const loggedUser = await this.storage.get('loggedUser');
    if (loggedUser) {
      this.loggedUser = loggedUser;
    }
  }

  async findByUsername(username: string): Promise<Login | undefined> {
    const userRef = collection(this.firestore, 'users');
    const q = query(userRef, where('username', '==', username));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return undefined;
    }
    const userData = snapshot.docs[0].data();
    return {
      username: userData['username'],
      password: userData['password'],
      email: userData['email'],
      name: userData['name'],
      birth_date: userData['birth_date'],
      career: userData['career'],
      genre: userData['genre'],
      occupation: userData['occupation'],
      phone: userData['phone'],
      student_id: userData['student_id'],
    };
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.findByUsername(username);
      if (user && user.password === password) {
        this.registerLoggedUser(user);
        return true;
      }
    } catch (error) {
      console.error('Error during login', error);
    }
    return false;
  }

  registerLoggedUser(login: Login): void {
    this.loggedUser = login;
    this.storage.set('loggedUser', login);
  }

  getLoggedUser(): Login | undefined {
    return this.loggedUser;
  }

  logOut(): void {
    this.loggedUser = undefined;
    this.storage.remove('loggedUser');
  }

  isAuthenticated(): boolean {
    return this.loggedUser !== undefined;
  }
}

export { Login };

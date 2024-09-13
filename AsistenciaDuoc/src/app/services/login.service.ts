import { Injectable } from '@angular/core';
import { Login } from '../models/login'
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loggerUser!: Login;

  logins: Login[] = [
    {
      username: 'admin',
      password: '1234'
    },
    {
      username: 'Aron',
      password: 'Pass'
    }
  ]

  constructor() { }

  findByUsername(u: String): Login| undefined{
    return this.logins.find(L => L.username === u)
  }

  registerLoggerUser(login: Login){
    this.loggerUser = login;
  }

  isAuthenticated(): boolean{
    console.log(this.loggerUser)
    return this.loggerUser !== undefined
  }
}

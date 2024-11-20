import { Timestamp } from '@angular/fire/firestore';

export class Asignatura {
  codigo: string;      // Código único de la asignatura
  dia: string;         // Día de la semana (Lunes, Martes, etc.)
  hora: Timestamp;     // Hora en la que se imparte la clase (tipo Timestamp)
  nombre: string;      // Nombre de la asignatura
  profesor: string;    // Nombre del profesor
  sala: string;        // Sala en la que se imparte la clase
  seccion: string;     // Sección de la asignatura

  constructor (
    codigo: string,
    dia: string,
    hora: Timestamp,
    nombre: string,
    profesor: string,
    sala: string,
    seccion: string
  ) {
    this.codigo = codigo;
    this.dia = dia;
    this.hora = hora;
    this.nombre = nombre;
    this.profesor = profesor;
    this.sala = sala;
    this.seccion = seccion;
  }
}
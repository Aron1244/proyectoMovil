import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClimateService {
  private baseUrl = 'https://wttr.in/Santiago?format=j1'; // Endpoint por defecto

  constructor(private http: HttpClient) {}

  getWeather(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}

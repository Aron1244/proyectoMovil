import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rest-pass',
  templateUrl: './rest-pass.page.html',
  styleUrls: ['./rest-pass.page.scss'],
})
export class RestPassPage implements OnInit {

  developer: String = 'ByteForge'
  Correo!: String;
  alertButtons = ['Aceptar'] ;
  
  constructor() { }

  

    

  ngOnInit() {
    
  }

}

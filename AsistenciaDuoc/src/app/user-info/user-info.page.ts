import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  user!: string;
  nombre: string = 'Admin';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user?: string };
    if (state && state.user) {
      this.user = state.user;
    } else {
      console.error('No se encontró el estado del usuario');
    }
  }

  ngOnInit() {}
}

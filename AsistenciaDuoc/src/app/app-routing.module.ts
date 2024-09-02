import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'user-info',
    loadChildren: () =>
      import('./user-info/user-info.module').then((m) => m.UserInfoPageModule),
  },
  {
    path: 'clases',
    loadChildren: () =>
      import('./clases/clases.module').then((m) => m.ClasesPageModule),
  },
  {
    path: 'historial',
    loadChildren: () =>
      import('./historial/historial.module').then((m) => m.HistorialPageModule),
  },  {
    path: 'rest-pass',
    loadChildren: () => import('./rest-pass/rest-pass.module').then( m => m.RestPassPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

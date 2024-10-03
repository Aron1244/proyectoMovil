import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'user-info',
    loadChildren: () =>
      import('./pages/user-info/user-info.module').then(
        (m) => m.UserInfoPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'clases',
    loadChildren: () =>
      import('./pages/clases/clases.module').then((m) => m.ClasesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'historial',
    loadChildren: () =>
      import('./pages/historial/historial.module').then(
        (m) => m.HistorialPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'rest-pass',
    loadChildren: () =>
      import('./pages/rest-pass/rest-pass.module').then(
        (m) => m.RestPassPageModule
      ),
    canActivate: [NoAuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

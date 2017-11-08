import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import our components
import { DashboardComponent } from './dashboard/dashboard.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { MessageColumnComponent } from './message-column/message-column.component'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { LoggingOutComponent } from './logging-out/logging-out.component'


const routes: Routes = [
  // Add the redirect
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'messages/:id',
    component: DashboardComponent
  },
 {
    path: 'login',
    component: LoginComponent
  },
 {
    path: 'log-out',
    component: LoggingOutComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

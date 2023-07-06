import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import {canActivate,redirectUnauthorizedTo,redirectLoggedInTo} from '@angular/fire/auth-guard'

const redirectToLogin=()=>redirectUnauthorizedTo(['/login']);
const redirectToHome= ()=>redirectLoggedInTo(['/home'])

const routes: Routes = [
  {path:'',component:LandingPageComponent,pathMatch:'full'},
  {path:'login',component:LoginComponent,...canActivate(redirectToHome)},
  {path:'register',component:RegisterComponent,...canActivate(redirectToHome)},
  {path:'home',component:HomeComponent,...canActivate(redirectToLogin)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

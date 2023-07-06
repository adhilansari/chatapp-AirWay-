import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {
  constructor(private authService:AuthenticationService,private router:Router,private toast:HotToastService){}
  loginForm = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(6)])
  })

   //loginForm.controls
   get FC(){
    return this.loginForm.controls;
  };
  submit(){
    if(this.loginForm.invalid) return
    const {email,password} = this.loginForm.value
    console.log(email,password);

    this.authService.login(email!,password!).pipe(
      this.toast.observe({
        success:'Logged in successfully',
        loading:'Logging in..',
        error:'There was an error'
      })
    ).subscribe(()=>{
      this.router.navigateByUrl('/home')
    })

  }

}

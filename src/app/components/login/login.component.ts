import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit{
  constructor(private authService:AuthenticationService,private router:Router,private toast:HotToastService,private FB:FormBuilder){}

  loginForm=this.FB.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]]

  })

  // loginForm = new FormGroup({
  //   email:new FormControl('',[Validators.required,Validators.email]),
  //   password:new FormControl('',[Validators.required,Validators.minLength(6)])
  // })
  ngOnInit(): void {

  }

   //loginForm.controls
   get FC(){
    return this.loginForm.controls;
  };
  submit(){
    if(this.loginForm.invalid) return
    const {email,password} = this.loginForm.value
    this.authService.login(email!,password!).pipe(
      this.toast.observe({
        success:'Logged in successfully',
        loading:'Logging in..',
        error:'There was an error/ User not found'
      })
    ).subscribe(()=>{
      this.router.navigateByUrl('/home')
    })

  }

}

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { IProfile } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

export function passwordMatchValidator():ValidatorFn {
  return (control:AbstractControl): ValidationErrors | null =>{
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword');

    if(!password || !confirmPassword) return null

    if(password&&confirmPassword && password.value!==confirmPassword.value) {
       confirmPassword.setErrors({notMatch:true})
    }else{
      const errors = confirmPassword?.errors;
      if(errors){
        delete errors.notMatch;
        confirmPassword?.setErrors(errors);
      }
    }
    return null
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private auth:AuthenticationService,private toast:HotToastService,private router:Router,private userService:UserService,private FB:FormBuilder){}
  registerForm=this.FB.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]],
    confirmPassword:['',Validators.required]
  },{validators:passwordMatchValidator()})

  get FC (){
    return this.registerForm.controls
  };
  submit(){
    if(!this.registerForm.valid) return
    const { name, email, password } =this.registerForm.value

    this.auth.register(email,password).pipe(
      switchMap(({user:{uid}})=>this.userService.addUser({ uid,email, displayName: name })
      ),
      this.toast.observe({
        success:'Congrats! You are all Signed Up',
        loading:'Singing in...',
        error:({message})=>`${message}`
      })
    ).subscribe(()=>{
      this.router.navigateByUrl('/home')
    })
  }
}

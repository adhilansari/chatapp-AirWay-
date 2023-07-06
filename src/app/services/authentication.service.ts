import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser$=authState(this.auth)
  constructor(private auth :Auth) { }

  // login User
  login(email:string,password:string){
    console.log(this.auth);

    return from(signInWithEmailAndPassword(this.auth,email,password))
  }
// logout User
  logOut(){
    return from(this.auth.signOut())
  }

  //register User
  register(name:string,email:string,password:string){
    return from(createUserWithEmailAndPassword(this.auth,email,password)).pipe(
      switchMap(({user})=> updateProfile(user,{displayName:name}))
    )
  }


}

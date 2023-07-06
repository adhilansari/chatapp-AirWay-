import { Injectable } from '@angular/core';
import { Auth, UserInfo, authState, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Observable, concatMap, from, of, switchMap } from 'rxjs';

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

  updateProfileData(profileData:Partial<UserInfo >):Observable<any>{
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap(user=>{
        if(!user) throw new Error('not Authenticated');
        return updateProfile(user,profileData)
      })
    )
  }

}

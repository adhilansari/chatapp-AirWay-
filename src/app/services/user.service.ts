import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData, doc, docData, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Storage,getDownloadURL,ref, uploadBytes } from '@angular/fire/storage';
import { Observable, concatMap, from, map, of, switchMap, take } from 'rxjs';
import { IProfile } from '../models/user.model';
import { AuthenticationService } from './authentication.service';
import { IChats, IMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storage:Storage,private fireStore:Firestore,private authService:AuthenticationService) { }

  // CURRENT USER
  get currentUserProfile$():Observable<IProfile|null>{
    return this.authService.currentUser$.pipe(
      switchMap(user=>{
        if(!user?.uid){
          return of(null)
        }
        const ref = doc(this.fireStore,'users',user.uid);
        return docData(ref) as Observable<IProfile>
      })
    )
  }
//UPLOADING PROFILE PIC
  uploadImg(image:File,path:string):Observable<string>{
    const storageRef = ref(this.storage,path)
    const uploadTask = from(uploadBytes(storageRef,image));
    return uploadTask.pipe(
      switchMap((result)=>getDownloadURL( result.ref))
    )
  }
//ADDING USER
  addUser(user:IProfile):Observable<any>{
    const ref = doc(this.fireStore,'users',user?.uid)
    return from(setDoc(ref,user))
  }

  //UPDATE USER
  updateUser(user:IProfile){
    const ref = doc(this.fireStore,'users',user?.uid)
    return from(updateDoc(ref,{...user}))
  }
//GET ALL USERS
  get allUsers$():Observable<IProfile[]>{
    const ref = collection(this.fireStore,'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<IProfile[]>
  }

}

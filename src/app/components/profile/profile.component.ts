import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private auth:AuthenticationService,private userService:UserService,private toast:HotToastService){}
  user$ = this.auth.currentUser$
  uploadImg(event:any,user:User){
    this.userService.uploadImg(event.target.files[0],`images/profile/${user.uid}`).pipe(
      this.toast.observe({
        loading:'Image is being uploaded...',
        success:'image uploaded successfully!',
        error:'there was an error while uploading'
      }),
      concatMap((photoURL)=>this.auth.updateProfileData({photoURL}))
    ).subscribe()
  }

}

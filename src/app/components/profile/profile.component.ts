import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concatMap } from 'rxjs';
import { IProfile } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private auth: AuthenticationService, private userService: UserService, private toast: HotToastService) { }
  ngOnInit(): void {
    this.userService.currentUserProfile$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.profileForm.patchValue({ ...user })
    })
  }
  user$ = this.userService.currentUserProfile$

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    email: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),

  })

  get FC() {
    return this.profileForm.controls
  }

  uploadImg(event: any, user: IProfile) {
    this.userService.uploadImg(event.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe({
        loading: 'Image is being uploaded...',
        success: 'image uploaded successfully!',
        error: 'there was an error while uploading'
      }),
      concatMap((photoURL) => this.userService.updateUser({uid:user.uid, photoURL }))
    ).subscribe()
  }

  saveProfile() {
    const profileData=this.profileForm.value
    this.userService.updateUser(profileData as IProfile).pipe(
      this.toast.observe({
        loading:'Updating data...',
        success:'Data has been updated',
        error:'there was an error while updating data'
      })
    ).subscribe()
  }

}

import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatapp';
  constructor(private authService:AuthenticationService,private router:Router,private usrerService:UserService){}
  user$=this.usrerService.currentUserProfile$
  logout(){
    this.authService.logOut().subscribe(()=>{
      this.router.navigateByUrl('')
    })
  }

}

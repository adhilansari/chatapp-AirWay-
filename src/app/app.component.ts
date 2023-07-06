import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatapp';
  constructor(public authService:AuthenticationService,private router:Router){}

  logout(){
    this.authService.logOut().subscribe(()=>{
      this.router.navigateByUrl('')
    })
  }

}

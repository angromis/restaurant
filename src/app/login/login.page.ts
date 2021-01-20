import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthenticationService } from "../shared/authentication.service";
import { DatabaseService } from '../shared/database.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
dark;
public tmp:boolean;
  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private database: DatabaseService 
  ) {
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
  }

  ngOnInit(
  ) {
    
  }
  

  logIn(email, password) {
   
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
     
      this.authService.logedinuser = res.user;
        if(res.user.emailVerified) {
          this.router.navigate(['dashboard']);          
        } else {
          window.alert('Email is not verified')
          return false;
        }
      }).catch((error) => {
        window.alert(error.message)
      })
  }

}
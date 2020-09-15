import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../shared/authentication.service";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  myemail:string;
  constructor(
    public authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  resetPassword(myemail){
    
    this.authService.PasswordRecover(myemail);
    
  }

}

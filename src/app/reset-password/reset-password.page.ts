import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../shared/authentication.service";
import { DatabaseService } from '../shared/database.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  myemail:string;
  dark;
  constructor(
    public authService: AuthenticationService,private database: DatabaseService
  ) { this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
    let item: any = res.payload.data();
    this.dark = item.dark;
   
   
  }) }

  ngOnInit() {
  }

  resetPassword(myemail){
    
    this.authService.PasswordRecover(myemail);
    
  }

}

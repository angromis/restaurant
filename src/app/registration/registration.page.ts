import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AuthenticationService } from "../shared/authentication.service";
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registerForm: FormGroup;


  
  constructor(public authService: AuthenticationService,
    public formBuilder: FormBuilder,
    public router: Router) {
      
     }
   

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name:[''],
      email:[''],
      password: [''],
      confirmpass:['']
      
    })
     
    
  }
  
   
  signUp(){
    if (this.registerForm.value.confirmpass == this.registerForm.value.password){
      this.authService.RegisterUser(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.name)      
    

      this.router.navigate(['verify-email']);
    }
    else{
      this.registerForm.reset();
      window.alert("Passwords don't match");
    }
    
}

}

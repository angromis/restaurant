import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from "./user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';

 

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;
 mailverified;
  logedinuser: User;
  

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone 
  ) {
  
  }

  // Login in with email/password
  SignIn(email, password) {
  
   

    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }

 

  // Email verification when new user register
  SendVerificationMail() {
    return this.ngFireAuth.currentUser.then(res => res.sendEmailVerification())
   
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      
      window.alert(error)
    })
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

 
  

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
    .then((result) => {
      console.log(result.user.displayName)
      console.log(result.user.photoURL)
      this.logedinuser = result.user;
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
    
   
    }).catch((error) => {
      window.alert(error)
    })
  }
  // Register user with email/password
  RegisterUser(email, password, name) {
  
    
   this.ngFireAuth.createUserWithEmailAndPassword(email, password).then((res) => {
    // Do something here

    
    res.user.updateProfile({
      displayName: name,
      photoURL: null
    }).finally
    
   
    this.SendVerificationMail();
  }).catch((error) => {
    window.alert(error.message)
  })
   
    
  }
  getUser(){
    return this.logedinuser;
  }
  // Store user in localStorage
  

  // Sign-out 
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
     
      this.router.navigate(['home']);
    })
  }

}
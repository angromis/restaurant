import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from './../shared/database.service'; 
import { AuthenticationService } from "../shared/authentication.service";
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  createForm: FormGroup;
  restaurants: string [];

  constructor( private rstService: DatabaseService,
    private router: Router,
    public fb: FormBuilder,
    public authService: AuthenticationService) { }

  ngOnInit() {
    this.createForm = this.fb.group({
      name:[''],
      review:[''],
      vote:[''],
      user:[this.authService.getUser().displayName]
    })
   
   this.restaurants = this.rstService.fetchRestaurants();

  }
  
  
  formSubmit(){
    if(!this.createForm.valid){
      return false;
    }
    else{
     
      this.rstService.addReview(this.createForm.value).then(res => {
        this.createForm.reset();
        
      })
        .catch(err => console.log(err));

      
    }
    
    
    console.log("~~~~~~~~~~~~")
    this.router.navigate(['/dashboard']);
  }

 
 
}

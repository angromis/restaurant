import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.page.html',
  styleUrls: ['./add-restaurant.page.scss'],
})
export class AddRestaurantPage implements OnInit {

  dark;
  addForm: FormGroup;
  constructor(public formbuild: FormBuilder, private database: DatabaseService, private router: Router) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
  }

  ngOnInit() {
    this.addForm = this.formbuild.group({

    });
  }
  formSubmit(){
   

    // this.addDeadlineForm.value.created = new Date().toDateString();
    // this.addDeadlineForm.value.tags = this.deadlineTaglist;
    // this.addDeadlineForm.value.list = this.list1;
    // this.addDeadlineForm.value.type = "deadline";
    // this.addDeadlineForm.value.done = false;
   
    
    if(!this.addForm.valid){
      return false;
    }
    else{
     
      // this.database.addRestaurant(this.addForm.value).then(res => {
      //   this.addForm.reset();
      //   this.router.navigate(['/deadlines']) ;
         
      // })
      //   .catch(err => console.log(err));

      
    }
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }
}

import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.page.html',
  styleUrls: ['./edit-restaurant.page.scss'],
})
export class EditRestaurantPage implements OnInit {

  dark;
  id:any;
  eventTaglist = [];
  downloadableURL = '';  
  updateForm: FormGroup;
  constructor(private database: DatabaseService,public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
    this.id = this.actRoute.snapshot.paramMap.get('id'); 
   
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name:[''],
      address:[''],
      phone:[''],
      site:[''],
      description:['']
    })
    
    this.database.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;

        if(item.id === this.id){

          this.eventTaglist = item.cousine;
         this.downloadableURL = item.photo;
        this.updateForm = this.fb.group({
          name:[item.name],
          address:[item.address],
          phone:[item.phone],
          site:[item.site],
          description:[item.description]
        })
        console.log(this.updateForm)
      
        }
        
      });
    });
    
  }
  formSubmit(){
    console.log(this.updateForm)

  }

 
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  reserveForm: FormGroup;
  public foodList: any[];
  current:string ;
  searchTerm:any;
  constructor(public fb: FormBuilder,  public router: Router, private firestore: AngularFirestore ) { }
  
  async ngOnInit() {
    this.reserveForm = this.fb.group({
      name: [''],
      persons:[''],
      restaurant:[''],
      date:[''],
      time:[''],
      phone:[''],
      note:['']

    })
    this.foodList = await this.initializeItems();
  }
  formSubmit(){
    console.log(this.reserveForm.value)
    this.reserveForm.reset();
    window.alert('You reservation request has been sent to the restaurant. They will call you for a confirmation. Thank you!')
    this.router.navigate(['dashboard']);    
  }
  getCurrent(myname: string){
    this.current = myname
    
    console.log(this.reserveForm.value)
  }

  async initializeItems(): Promise<any> {
    const foodList = await this.firestore.collection('restaurant')
      .valueChanges().pipe(first()).toPromise();
    return foodList;
  }
  async filterList(evt) {
    this.foodList = await this.initializeItems();
    this.searchTerm = evt.srcElement.value;
  
    if (!this.searchTerm) {
     
      return;
    }
    
    this.foodList = this.foodList.filter(currentFood => {
      if (currentFood.name && this.searchTerm) {
       // console.log(currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        return (currentFood.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
      }
    });
  }
}

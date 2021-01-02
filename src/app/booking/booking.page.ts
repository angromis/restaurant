import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
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
  id:any;

  constructor(private actRoute: ActivatedRoute, public fb: FormBuilder,  public router: Router, private firestore: AngularFirestore ) {

   

   }
  
  async ngOnInit() {
    
    this.id = this.actRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.reserveForm = this.fb.group({
      name: [''],
      persons:[''],
      restaurant:[''],
      date:[''],
      time:[''],
      phone:[''],
      note:['']

    })
    
    
  }

  getDisableInput(){
    if (this.id === " "){
      return false;
    }
    else{
      return true;
    }
  }

  formSubmit(){ 
    
    this.reserveForm.reset();
    window.alert('You reservation request has been sent to the restaurant. They will call you for a confirmation. Thank you!')
    this.router.navigate(['dashboard']);    
  }
  getCurrent(myname: string){
    this.current = myname
    
   
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

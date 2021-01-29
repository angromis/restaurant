import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.page.html',
  styleUrls: ['./edit-restaurant.page.scss'],
})
export class EditRestaurantPage implements OnInit {

  dark;
  constructor(private database: DatabaseService, private router: Router) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
  }

  ngOnInit() {
  }

  goHome(){
    this.router.navigate(['/dashboard']); 
  }
}
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.page.html',
  styleUrls: ['./add-restaurant.page.scss'],
})
export class AddRestaurantPage implements OnInit {

  dark;
  constructor(private database: DatabaseService) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
  }

  ngOnInit() {
  }

}

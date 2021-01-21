import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit {

  dark;
  restaurants: any [];
  constructor(private database: DatabaseService, private router: Router) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
  }

  ngOnInit() {
    this.restaurants = this.database.fetchRestaurants();
  }

  goHome(){
    this.router.navigate(['/dashboard']); 
  }
}

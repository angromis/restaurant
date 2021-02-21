import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
  constructor(private database: DatabaseService, private router: Router, private afStorage: AngularFireStorage) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
  }
  ionViewDidEnter(){
    this.restaurants = this.database.fetchRestaurants();
  }

  ngOnInit() {
    this.restaurants = this.database.fetchRestaurants();
  }

  goHome(){
    this.router.navigate(['/dashboard']); 
  }
  onDelete(id: string,url:string){
    if (window.confirm('Do you really want to delete?')) {
      if(url){ this.afStorage.storage.refFromURL(url).delete();}
       
      this.database.deleteRestaurant(id);
      this.router.navigate(['/restaurants']);
      window.location.reload();
    }
  }
  onEdit(id: string){
    console.log(id);
  }
  getDetailedRestaurant(id: string){
    
    this.router.navigate(['/details/',id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { DatabaseService} from "../shared/database.service";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
})
export class TagsPage implements OnInit {

  id:any;
  restaurants: any [];
  dark;

  filterTerm: string;
  constructor(private actRoute: ActivatedRoute,
    private router: Router, public dataservice: DatabaseService) {
      this.id = this.actRoute.snapshot.paramMap.get('id');
      this.dataservice.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
        let item: any = res.payload.data();
        this.dark = item.dark;
       
       
      })
      
     }

  ngOnInit() {
    this.findRestaurants(this.id);
  }

  findRestaurants(tagName: string){

    
    this.restaurants = this.dataservice.fetchTagRestaurants(tagName);

   
    

    
      
    
  }
  getDetailedRestaurant(id: string){
    
    this.router.navigate(['/details/',id]);
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }

}

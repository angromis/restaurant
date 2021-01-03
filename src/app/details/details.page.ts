import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { DatabaseService} from "../shared/database.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  id:any;
  reviews: any [];
  restaurant: any;
  description1: string;
  description2: string;
  constructor( private actRoute: ActivatedRoute,
    private router: Router, public dataservice: DatabaseService) { 
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {


    this.reviews = this.dataservice.fetchReviews(this.id);


    
    this.dataservice.db.collection('restaurant').snapshotChanges().subscribe( res => {
      this.restaurant = [];
      res.forEach(a => {
        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;
       
        if(item.id == this.id){
          this.restaurant.push(item);
         
          this.showMoreString(item.description);
         
        }
       
       
      });
    });
   
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }
  getDetailedTag(id: string){
    
    this.router.navigate(['/tags/',id]);
  }

  bookNow(id: string){
  
    
      this.router.navigate(['/booking/',id]);
    
  }

  showMoreString(theString){

    let index = theString.indexOf(" ", 50);
    this.description1 = theString.substring(0, index),
    this.description2 = theString.substring(index + 1, theString.length);

  }
  showMoreFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less"; 
      moreText.style.display = "inline";
    }
  }

}

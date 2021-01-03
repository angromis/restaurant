import { Component, OnInit } from '@angular/core';
import { DatabaseService} from "../shared/database.service";
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hot',
  templateUrl: './hot.page.html',
  styleUrls: ['./hot.page.scss'],
})
export class HotPage implements OnInit {

  slideOptions = {
  
    initialSlide: 1,
    speed: 5000,
    
    
    
  };
  bestRestaurants:any;
  offers:string [];
  constructor( public dataservice: DatabaseService, private router: Router) { }

  ngOnInit() {

    this.bestRestaurants = this.dataservice.fetchBestRestaurants();
    this.offers = [
      "CTC specil offer 50% discount for 2 persons!",
      "20% discount for an order more than 120 euros in Balthazar!",
      "Veloutte soup only for the next two days in Cookoovaya!",
      "Happy noon!Free drinks from 12am to 3 pm in Τηλέμαχος.",
      "Free delivery for orders more than 20 euros in Kiouzin",
      "Hytra for the win!!! Free desert for lonely"
    ];
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
    
  }
  getDetailedRestaurant(id: string){
    
    this.router.navigate(['/details/',id]);
  }

  bookNow(id: string){
  
    
    this.router.navigate(['/booking/',id]);
  
}
goHome(){
  this.router.navigate(['/dashboard']); 
}

}

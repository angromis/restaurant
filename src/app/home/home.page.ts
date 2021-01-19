import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular'
import { Platform } from '@ionic/angular';
import { DatabaseService } from '../shared/database.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ImageArray: any = [];
  subscribe: any;

  slideOptions = {
    initialSlide: 1,
    speed: 400,
  };
  dark;

  constructor(public navCtrl: NavController, public platform: Platform,private database: DatabaseService) {
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
    this.ImageArray=[
      {'image':'../../assets/images/image1.jpg'},
      {'image':'../../assets/images/image2.jpg'},
      {'image':'../../assets/images/image3.jpg'},
      {'image':'../../assets/images/image4.jpg'},
      {'image':'../../assets/images/image5.jpg'},
      {'image':'../../assets/images/image6.png'},
      {'image':'../../assets/images/image7.jpg'},
      {'image':'../../assets/images/image8.jpg'},
      {'image':'../../assets/images/image9.jpg'},
      {'image':'../../assets/images/image10.jpg'}
      
    ]
    this.subscribe = this.platform.backButton.subscribeWithPriority(666666,() =>{
      if(this.constructor.name == "HomePage"){
        if(window.confirm("Do you want to exit app?")){
          navigator["app"].exitApp();
        }
      }
    })
  }
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

}

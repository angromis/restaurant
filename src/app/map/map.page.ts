import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DatabaseService} from "../shared/database.service";
import {
  ModalController,
  ToastController,
  
} from '@ionic/angular';

import { Router } from '@angular/router';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  @ViewChild('map',null) mapElementRef: ElementRef;
  clickListener: any;
  googleMaps:any;
  dark;
  address:string;
  restaurants: any ;

  constructor( public toastCtrl: ToastController, public dataservice: DatabaseService,
     private router: Router,private modalCtrl: ModalController, private renderer: Renderer2) { 

      this.dataservice.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
        let item: any = res.payload.data();
        this.dark = item.dark;
       
       
      })
      
  }

  ngOnInit() {

   
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }
  ngAfterViewInit(){

    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map =  new googleMaps.Map(mapEl, {
        center: {lat:38.0482, lng: 23.7558}, 
        zoom: 16
      });
      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      this.clickListener = map.addListener('click', event => {
        const selectedCoords = {lat: event.latLng.lat(), 
                                lng: event.latLng.lng()
        };
        this.modalCtrl.dismiss(selectedCoords);
      });
    }).catch(err =>{
      console.log(err);
    });
  }

  private getGoogleMaps(): Promise<any>{
    const win = window as any;
    const googleModule = win.google;

    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject)=>{
      const script = document.createElement('script');
      script.src = 'src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQFMSBMQmkR2iR-PZ9prufnLRZc-1INMo">';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps){
          resolve(loadedGoogleModule.maps);
        }
        else{
          reject('Google SDK not availiable')
        }

      };
    })
  }
  //ngOnDestroy(){
 
}

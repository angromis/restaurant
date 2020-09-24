import { Component, OnInit } from '@angular/core';
import { DatabaseService} from "../shared/database.service";
import {
  ToastController,
  Platform
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';
import { Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: GoogleMap;
  address:string;
  restaurants: any ;

  constructor( public toastCtrl: ToastController, public dataservice: DatabaseService,
    private platform: Platform) { 

     
      
  }

  ngOnInit() {

    this.platform.ready();
    
    this.restaurants = this.dataservice.fetchRestaurants();
    
    this.loadMap();
    
  }

  loadMap() {
    
    
    this.map = GoogleMaps.create('map_canvas', {
       camera: {
        target: {
          lat: 37.0741704,
          lng: 23.0009802
        },
         zoom: 10,
         tilt: 30
       }
    });
    this.createMarkers();
    this.goToMyLocation();
  }

  createMarkers(){

    console.log("----");
    this.restaurants.forEach(element => {

      
      let  marker2:Marker = this.map.addMarkerSync({
        title: '',
        snippet: element.name,
        position: {
          lat: element.location.latitude,
          lng: element.location.longitude
        },
        animation: GoogleMapsAnimation.BOUNCE

      });
      
      marker2.showInfoWindow();
    });

  }

  goToMyLocation(){
    //this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

      //add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'You are here',
        snippet: '',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });
      

     

      //show the infoWindow
      
      marker.showInfoWindow();
      

      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
            console.log("Click MAP",data);
        }
      );
    })
    .catch(err => {
      //this.loading.dismiss();
      this.showToast(err.error_message);
    });
  }
  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModelComponent } from '../../map-model/map-model.component';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/admin/restaurants/location.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  selectedLocationImage:string;
  isLoading = false;
  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {}

  onPickLocation(){
    this.modalCtrl.create({component: MapModelComponent}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if(!modalData.data){
          return
        }
        const pickedLocation: PlaceLocation = {
          lat:modalData.data.lat,
          lng:modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng).pipe(switchMap(address => {
          pickedLocation.address = address;
          return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));

        })).subscribe(staticMapImageUrl => {
          pickedLocation.staticMapImageUrl = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          this.isLoading = false;
        });
      });
      modalEl.present();
    })
  }
  private getAddress(lat: number, lng: number){
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAQFMSBMQmkR2iR-PZ9prufnLRZc-1INMo`).pipe(map(geoData => {

     if(!geoData || !geoData.results || geoData.results.length === 0){
       return null;
     }
     return geoData.results[0].formatted_address;
    }));
  }

  private getMapImage(lat: number, lng: number, zoom: number){
   // return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&markers=color:blue%7Clabel:S%7C${lat},${lng}&key=AIzaSyAQFMSBMQmkR2iR-PZ9prufnLRZc-1INMo`
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&markers=color:orange%7Clabel:S%7C11211%7C11206%7C11222&key=AIzaSyAQFMSBMQmkR2iR-PZ9prufnLRZc-1INMo`
   // return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&key=AIzaSyAQFMSBMQmkR2iR-PZ9prufnLRZc-1INMo`
  }

}

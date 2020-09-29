import { Injectable } from '@angular/core';
import { Review} from '../shared/Review';

import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { AngularFireDatabaseModule, AngularFireObject, AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Observable,  } from 'rxjs';
import { map, retryWhen } from  'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { NativeGeocoder,  NativeGeocoderOptions } from '@ionic-native/native-geocoder';




@Injectable({
  providedIn: 'root'
}) 

export class DatabaseService {
 items = [];
  restlistRef: AngularFireList<any>;
  restRef: AngularFireObject<any>;
 
  sum :number;
  count: number;
  
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(public db: AngularFirestore, private db2: AngularFireDatabase
   ) {
   
  }


  
  fetchRestaurants(){
    let restaurants = [];

    this.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;

        restaurants.push(item);

      });
      
     
    });   
       
     return restaurants;     

  }
  fetchBestRestaurants(){

    let restaurants = [];
    let gap = 7.5;

    this.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;


        if(item.rating>gap){
          restaurants.push(item);
        }
        

      });
      
     
    });   
       
     return restaurants; 
  }
  
  
  fetchReviews(name){
    let reviews = [];

    this.db.collection('reviews').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;

        if(item.name === name){

          reviews.push(item);
        }
        

      });
      
     
    });   
       
     return reviews;     

  }


  // getGeolocation(){
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     this.geoLatitude = resp.coords.latitude;
  //     this.geoLongitude = resp.coords.longitude; 
  //     this.geoAccuracy = resp.coords.accuracy; 
  //   //   this.getGeoencoder(this.geoLatitude,this.geoLongitude);
  //   //  }).catch((error) => {
  //   //    alert('Error getting location'+ JSON.stringify(error));
  //     });
  // }


  
addReview(rev: Review){
      let name =  rev.name;
      let review =  rev.review;
      let vote = rev.vote;
      let userName = rev.user;
    
  return firebase.firestore().collection('reviews').doc().set({name: name, review: review, vote: vote, user:userName});
  
}


 
}

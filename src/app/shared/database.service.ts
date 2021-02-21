import { Injectable } from '@angular/core';
import { Review} from '../shared/Review';

import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { AngularFireDatabaseModule, AngularFireObject, AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Observable,  } from 'rxjs';
import { map, retryWhen } from  'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Restaurant } from './Restaurant';
//import { NativeGeocoder,  NativeGeocoderOptions } from '@ionic-native/native-geocoder';




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

  tags: string[] = ['Μεσογειακή', 'Ευρωπαϊκή', 'Ελληνική', 'Σύγχρονη', 'Vegeterian',
   'Σούσι', 'Πρωινό', 'Μεζεδοπωλείο', 'Ιταλική', 'Πίτσα', 'Θαλασσινά', 'Διεθνής',
    'Αμερικανική', 'Barbeque', 'Μπαρ', 'Καφέ', 'Vegan',
     'Γαλλική', 'Γκριλ',' Ψητοπωλείο', 'Wine bar', 'Indin', 'Asian', 'Healthy']
  
  constructor(public db: AngularFirestore, private db2: AngularFireDatabase
   ) {
   
  }


  addReview(rev: Review){
    let name =  rev.name;
    let review =  rev.review;
    let vote = rev.vote;
    let userName = rev.user;
  
return firebase.firestore().collection('reviews').doc().set({name: name, review: review, vote: vote, user:userName});

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
  getTags(){
    return this.tags;
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
  fetchSearchResults(filter:string, upper:string){
    let restaurants = [];

    this.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;
        if(item.name.includes(filter) || item.name.includes(upper)){
          restaurants.push(item)
         
        }

      });
      
     
    });   
       
     return restaurants; 

  }



  


  fetchTagRestaurants(tagName: string){

    let restaurants = [];

    this.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;

        if((item.cousine).includes(tagName)){

          restaurants.push(item);
         
    
        }
        

      });
      
     
    });   
       
     return restaurants; 
  }
  deleteRestaurant(id: string){
    return this.db.collection('restaurant').doc(id).delete();
  }

  // fetchLocationsRestaurants(){
    
  //   let restaurants = [];

  //   this.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
  //     res.forEach(a => {
      

  //       let item:any = a.payload.doc.data();
  //       item.id = a.payload.doc.id;

        

  //         restaurants.push({lag:item.location.latitude, lon:item.location.longitude});
          
        
        

  //     });
      
     
  //   });   
    
    
       
  //    return restaurants; 

  // }
  
  
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


  addSettings(hours: number, minutes: number, dark: boolean){
   

    return this.db.collection('settings').doc("daily").set({hours: hours, minutes: minutes, dark: dark});
  }

addRestaurant(res: Restaurant){
  let name = res.name;
    let description = res.description;
    let photo = res.photo;
    let phone = res.phone;
    let location = res.location;
    let cousine = res.cousine;
    let site = res.site;
    let rating =5;
   console.log(res)
     return this.db.collection('restaurant').doc(name).set({name: name, description:description, photo: photo,
        phone: phone, location: location, cousine: cousine, site: site,rating: rating});

}
editRestaurant(res:Restaurant, id: string){

  let name = res.name;
  let description = res.description;
  let photo = res.photo;
  let phone = res.phone;
  let location = res.location;
  let cousine = res.cousine;
  let site = res.site;
  let rating =5;
  return this.db.collection('restaurant').doc(id).update({name: name, description:description, photo: photo,
    phone: phone, location: location, cousine: cousine, site: site,rating: rating});

}
 
}

import { Injectable } from '@angular/core';
import { Review} from '../shared/Review';

import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { AngularFireDatabaseModule, AngularFireObject, AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Observable,  } from 'rxjs';
import { map, retryWhen } from  'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
}) 

export class DatabaseService {
 items = [];
  restlistRef: AngularFireList<any>;
  restRef: AngularFireObject<any>;
 
  sum :number;
  count: number;
  

  constructor(public db: AngularFirestore, private db2: AngularFireDatabase  ) {
   
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


 

  kala(){
    let ola = [];
    ola.push("wwewe");
    ola.push("oppapappaapa");

    console.log(ola);
    return ola;
  }

  
addReview(rev: Review){
      let name =  rev.name;
      let review =  rev.review;
      let vote = rev.vote;
    
  return firebase.firestore().collection('reviews').doc().set({name: name, review: review, vote: vote})
  
}


 
}

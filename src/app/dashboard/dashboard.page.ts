import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../shared/authentication.service";
import { User } from "../shared/user";
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular'
import { DatabaseService} from "../shared/database.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {

  slideOptions = {
  
    initialSlide: 1,
    speed: 650,
    
  };

  restList = [];
  revList = [];
  num = 0;
  userlogedin : User;
   
   count: any;

   isItemAvailable = false;
   items = [];
   


  constructor(
    public dataService: DatabaseService,
    private router: Router,
    public authService: AuthenticationService
  ) { 
   this.userlogedin = this.authService.getUser();
  //this.userlogedin.displayName = "Kitsos";
    
  }

  ngOnInit(){

    this.updateRestaurants();
   
   
    
    
  
  }




  initializeItems(){
    

    
    this.dataService.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;

       

          this.items.push(item.name);
          this.items.push(item.cousine[0]);
          this.items.push(item.cousine[1]);
          this.items.push(item.cousine[2]);
          this.items.push(item.phone);
          this.items.push(item.site);



      });
      
     
    });   
       
    
    
  }

  getItems(ev: any) {
      // Reset items back to all of the items
      this.initializeItems();

      // set val to the value of the searchbar
      const val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() !== '') {
          this.isItemAvailable = true;
          this.items = this.items.filter((item) => {
              return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
      } else {
          this.isItemAvailable = false;
      }
  }


  updateRestaurants(){

    this.dataService.db.collection('restaurant').snapshotChanges().subscribe( res => { 
      this.restList = [];
      this.dataService.db.collection('reviews').snapshotChanges().subscribe( apo => {
      res.forEach(a => {
        let count = 0;
        let sum = 0;
        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;
       
       
          this.restList.push(item);
        
          apo.forEach(b => {
            
            let item2:any = b.payload.doc.data();
            item2.id = b.payload.doc.id;
           
            this.revList.push(item2);
           if(item.name === item2.name){
             count ++;
             sum += item2.vote;
           }

          });
          if(count>0){

            this.dataService.db.collection('restaurant').doc(item.name).update({
              rating: sum/count
             
            });
          }
          else{
            this.dataService.db.collection('restaurant').doc(item.name).update({
              rating: 0
             
            });
          }
         
        });
       
       
      });
      
      
    });
    
  }
  bookNow(id: string){
  
    
    this.router.navigate(['/booking/',id]);
  
}

  getDetailedRestaurant(id: string){
    
    this.router.navigate(['/details/',id]);
  }
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

}
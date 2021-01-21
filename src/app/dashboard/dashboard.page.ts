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
  userName:string;
   
   count: any;

   isItemAvailable = false;
   items = [];
   dark;
isAdmin:boolean = false;

  constructor(
    public dataService: DatabaseService,
    private router: Router,
    public authService: AuthenticationService
  ) { 
    this.dataService.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
    
   
   //console.log(this.userlogedin);
  //this.userlogedin.displayName = "Kitsos";
    
  }

  ngOnInit(){
    this.userlogedin = this.authService.getUser();
console.log(this.userlogedin)
    if(this.userlogedin===undefined){
      this.userName = 'Guest';
    }else{
      this.userName = this.userlogedin.displayName;
      if(this.userlogedin.email ==='andregromis@gmail.com')
        this.isAdmin = true;
    }
   console.log(this.userlogedin);

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
  addRestaurant(){
    this.router.navigate(['/add-restaurant']);
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
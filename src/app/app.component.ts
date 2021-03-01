import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';
import { DatabaseService } from './shared/database.service';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  dark;
  subscribe: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appService: DatabaseService
  ) {
    this.initializeApp();
    this.appService.db.collection('settings').snapshotChanges().subscribe( res => {
      res.forEach(a => {
             

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;
        this.dark = item.dark
                
      }); 
    });
  }

  exitApp(){
    this.subscribe = this.platform.backButton.subscribeWithPriority(666666,() =>{
    
        if(window.confirm("Do you want to exit app?")){
          navigator["app"].exitApp();
        }
      
    })

  }
  initializeApp() {
      this.platform.ready().then(() => {

     
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


  }
}

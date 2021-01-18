import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';
import { DatabaseService } from './shared/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  dark;
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

  initializeApp() {
      this.platform.ready().then(() => {

     
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


  }
}

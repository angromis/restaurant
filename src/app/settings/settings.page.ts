import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from '../shared/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  time;
  oldTime: string;
  dark;
  constructor(private router: Router,private database: DatabaseService,public toastController: ToastController) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
      if(item.hours<12){
        this.time = '0'+item.hours+":"+item.minutes;
      }
     else{
      this.time = item.hours+":"+item.minutes;
     }
     
    })
  }

  ngOnInit() {
  
  
  }

  goHome(){
    this.router.navigate(['/dashboard']); 
  }
  saveData(){
   
    let stringTime = this.time+""
    let minutes = parseInt(stringTime.substring(stringTime.length,3));
    let hours = parseInt(stringTime.substring(2,0)) 
    this.database.addSettings(hours,minutes, this.dark);

   
   
    this.presentToast();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
   
  }


}

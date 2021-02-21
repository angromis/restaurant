import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { PlaceLocation } from '../restaurants/location.model';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.page.html',
  styleUrls: ['./add-restaurant.page.scss'],
})
export class AddRestaurantPage implements OnInit {

  tagList;
  eventTaglist = [];
  file;
  imageRef;
  dark;
  addRestaurantForm: FormGroup;

    // File upload task 
    fileUploadTask: AngularFireUploadTask;

    // Upload progress
    percentageVal: Observable<number>;
  
    // Track file uploading with snapshot
    trackSnapshot: Observable<any>;
  
    // Uploaded File URL
    UploadedImageURL: Observable<string>;
  
    // Uploaded image collection
    files: Observable<imgFile[]>;
  
    // Image specifications
    imgName: string;
    imgSize: number;
    downloadableURL = '';  
    // File uploading status
    isFileUploading: boolean;
    isFileUploaded: boolean;
  
    private filesCollection: AngularFirestoreCollection<imgFile>;
    public isUploaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    public formbuild: FormBuilder,
     private database: DatabaseService, 
     private router: Router,
     private afs: AngularFirestore,
    private afStorage: AngularFireStorage
    ) { 
      this.tagList = this.database.getTags();
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })

    this.isFileUploading = false;
    this.isFileUploaded = false;
    
    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }

  ngOnInit() {
    this.addRestaurantForm = new FormGroup({
      name:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      description:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      phone:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      site:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      location:new FormControl(null,{
        validators:[Validators.required]
      }),
    });
  }


  onLocationPicked(location: PlaceLocation){
    this.addRestaurantForm.patchValue({location: location});
  }

  checkBoxes(tag:string){
    console.log(tag)
    if(this.eventTaglist.includes(tag))
    this.eventTaglist.forEach((value,index)=>{
      if(value==tag) this.eventTaglist.splice(index,1);
  });
  else{
    this.eventTaglist.push(tag);
  }
  }
  formSubmit(){
    this.downloadableURL = '';
    this.uploadImage();

    this.isUploaded.subscribe((value) => {

      if(value === true){
        this.addRestaurantForm.value.cousine = this.eventTaglist;
        this.addRestaurantForm.value.photo = this.downloadableURL;
    
    
        
        console.log(this.downloadableURL)
        
        if(!this.addRestaurantForm.valid){
          return false;
        }
        else{
          
          this.database.addRestaurant(this.addRestaurantForm.value).then(res => {
            this.addRestaurantForm.reset();
            this.router.navigate(['/restaurants']);
    
            
              
          })
            .catch(err => console.log(err));
    
          
        }
    
      }
    })


 


    
  
    
  
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }


  selectImage(event: FileList) {
      
    this.file = event.item(0)
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.downloadableURL = dataUrl;
    };

    fr.readAsDataURL(this.file);
    console.log(this.file)
    // Image validation
    if (this.file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    
   
}
public ionViewDidLeave() {
  
  this.isUploaded.unsubscribe();
 
}
async uploadImage(){
  
  console.log("UploadImage")
  this.isFileUploading = true;
    this.isFileUploaded = false;

    this.imgName = this.file.name;

    // Storage path
    const fileStoragePath = `${this.file.name}`;

    // Image reference
    this.imageRef = this.afStorage.ref(fileStoragePath);
    console.log(this.isFileUploading)
    console.log(this.isFileUploaded)
    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, this.file);
console.log(this.fileUploadTask.task)
    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    (await this.fileUploadTask).ref.getDownloadURL().then(url => {this.downloadableURL = url; this.isUploaded.next(true);});  
    
    
  
}



}

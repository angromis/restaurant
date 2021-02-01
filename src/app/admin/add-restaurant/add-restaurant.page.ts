import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/shared/database.service';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

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
  
    // File uploading status
    isFileUploading: boolean;
    isFileUploaded: boolean;
  
    private filesCollection: AngularFirestoreCollection<imgFile>;
  constructor(
    public formbuild: FormBuilder,
     private database: DatabaseService, 
     private router: Router,
     private afs: AngularFirestore,
    private afStorage: AngularFireStorage
    ) { 
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
    this.addRestaurantForm = this.formbuild.group({
      name:[''],
      address:[''],
      description:[''],
      phone:[''],
      site:['']
    });
  }
  formSubmit(){
   

    
   
    
    if(!this.addRestaurantForm.valid){
      return false;
    }
    else{
     
      // this.database.addRestaurant(this.addRestaurantForm.value).then(res => {
      //   this.addRestaurantForm.reset();
      //   this.router.navigate(['/deadlines']) ;
         
      // })
      //   .catch(err => console.log(err));

      
    }
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }


  selectImage(event: FileList) {
      
    this.file = event.item(0)

    console.log(event)
    // Image validation
    if (this.file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    
   
}
uploadImage(){
  this.isFileUploading = true;
    this.isFileUploaded = false;

    this.imgName = this.file.name;

    // Storage path
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${this.file.name}`;

    // Image reference
    this.imageRef = this.afStorage.ref(fileStoragePath);
    console.log("imageref "+this.imageRef)
    console.log("path "+fileStoragePath)
    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, this.file);

    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
  this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      
    finalize(() => {
      // Retreive uploaded image storage path
      this.UploadedImageURL = this.imageRef.getDownloadURL();
      
      this.UploadedImageURL.subscribe(resp=>{
       
        this.storeFilesFirebase({
          name: this.file.name,
          filepath: resp,
          size: this.imgSize
        });
        this.isFileUploading = false;
        this.isFileUploaded = true;
      },error=>{
        console.log(error);
      })
    }),
    tap(snap => {
        this.imgSize = snap.totalBytes;
    })
  )
}


storeFilesFirebase(image: imgFile) {
    const fileId = this.afs.createId();
    console.log("image")
    this.filesCollection.doc(fileId).set(image).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
}
}

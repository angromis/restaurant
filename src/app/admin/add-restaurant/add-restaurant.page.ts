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

  dark;
  addForm: FormGroup;

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
    this.addForm = this.formbuild.group({

    });
  }
  formSubmit(){
   

    // this.addDeadlineForm.value.created = new Date().toDateString();
    // this.addDeadlineForm.value.tags = this.deadlineTaglist;
    // this.addDeadlineForm.value.list = this.list1;
    // this.addDeadlineForm.value.type = "deadline";
    // this.addDeadlineForm.value.done = false;
   
    
    if(!this.addForm.valid){
      return false;
    }
    else{
     
      // this.database.addRestaurant(this.addForm.value).then(res => {
      //   this.addForm.reset();
      //   this.router.navigate(['/deadlines']) ;
         
      // })
      //   .catch(err => console.log(err));

      
    }
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
  }


  uploadImage(event: FileList) {
      
    const file = event.item(0)

    // Image validation
    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    this.isFileUploading = true;
    this.isFileUploaded = false;

    this.imgName = file.name;

    // Storage path
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;

    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);

    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);

    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();
        
        this.UploadedImageURL.subscribe(resp=>{
          console.log(resp)
          this.storeFilesFirebase({
            name: file.name,
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
    
    this.filesCollection.doc(fileId).set(image).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
}
}

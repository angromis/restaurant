import { Component, OnInit, Output } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';
import { PlaceLocation } from '../restaurants/location.model';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.page.html',
  styleUrls: ['./edit-restaurant.page.scss'],
})
export class EditRestaurantPage implements OnInit {

  changeImage = false;
  dark;
  file;
  imgName: string;
  id:any;
  eventTaglist = [];
  downloadableURL = '';  
  updateForm: FormGroup;
  mapImageUrl: string;
  changeLocation: boolean = false;
  isFileUploading: boolean;
  isFileUploaded: boolean;
  imageRef;
  fileUploadTask: AngularFireUploadTask;
  newdownloadableURL = '';
  tagList;
  // Upload progress
  percentageVal: Observable<number>;
  public isUploaded: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private database: DatabaseService,public fb: FormBuilder, private actRoute: ActivatedRoute, private router: Router,private afStorage: AngularFireStorage) { 
    this.database.db.collection('settings').doc("daily").snapshotChanges().subscribe(res => {
      let item: any = res.payload.data();
      this.dark = item.dark;
     
     
    })
    this.id = this.actRoute.snapshot.paramMap.get('id'); 
    this.tagList = this.database.getTags();
  }
  ionViewDidEnter(){
this.changeLocation=false;  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name:[''],
      phone:[''],
      site:[''],
      description:[''],
      location:['']
    })
    
    this.database.db.collection('restaurant').snapshotChanges().subscribe( res => {
     
      res.forEach(a => {
      

        let item:any = a.payload.doc.data();
        item.id = a.payload.doc.id;

        if(item.id === this.id){

    this.mapImageUrl = item.location.staticMapImageUrl;

          this.eventTaglist = item.cousine;
          console.log(this.eventTaglist)
         this.downloadableURL = item.photo;
        this.updateForm = this.fb.group({
          name:[item.name],
          phone:[item.phone],
          site:[item.site],
          description:[item.description],
          location:[item.location]
        })
      
        }
         
      });
    });
    
  }
  public ionViewDidLeave() {
  
    this.isUploaded.unsubscribe();
   
  }
  goHome(){
    this.router.navigate(['/dashboard']); 
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
  onLocationPicked(location: PlaceLocation){
    console.log(location)
    this.updateForm.patchValue({location: location});
  }
  formSubmit(){
    if(this.changeImage){
      this.afStorage.storage.refFromURL(this.downloadableURL).delete();
      this.uploadImage();
    }
    

    this.isUploaded.subscribe((value) => {

      if(value === true || this.changeImage === false) {
        console.log(this.updateForm)
  
        this.updateForm.value.cousine = this.eventTaglist;
        this.updateForm.value.photo = this.downloadableURL;
  
        if(!this.updateForm.valid){
          return false;
        }
        else{
        
          this.database.editRestaurant(this.updateForm.value, this.id).then(res => {
            this.updateForm.reset();
            this.router.navigate(['/restaurants']);
  
            
            
          })
            .catch(err => console.log(err));
  
          
        }
    }
    });

    

  }

  selectImage(event: FileList) {
      
    this.file = event.item(0)
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.newdownloadableURL = dataUrl;
    };

    fr.readAsDataURL(this.file);
    console.log(this.file)
    // Image validation
    if (this.file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    
   
}
async uploadImage(){
  console.log(this.file)
  this.isFileUploading = true;
    this.isFileUploaded = false;

    this.imgName = this.file.name;

    // Storage path
    const fileStoragePath = `${this.file.name}`;

    // Image reference
    this.imageRef = this.afStorage.ref(fileStoragePath);
    
    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, this.file);
    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    (await this.fileUploadTask).ref.getDownloadURL().then(url => {this.downloadableURL = url; this.isUploaded.next(true);});  
    
    
  
}

 
}

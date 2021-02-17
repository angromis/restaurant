import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MapModelComponent } from "./map-model/map-model.component";
import { LocationPickerComponent } from "./pickers/location-picker/location-picker.component";



@NgModule({
    declarations:[LocationPickerComponent, MapModelComponent],
    imports:[CommonModule, IonicModule],
    exports:[LocationPickerComponent,MapModelComponent],
    entryComponents: [MapModelComponent]
})


export class SharedModule{

}
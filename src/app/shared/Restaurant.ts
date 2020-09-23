import { Geoposition } from '@ionic-native/geolocation/ngx';

export class Restaurant{
    id: string;
    name: string;
    description: string;
    cuisine: string[];
    rating: number;
    phone: number;
    locatiom: Geoposition;
    site: string;
    photo: string;


    

}
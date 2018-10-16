import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { APIService } from '../../../services/api_service';
import { UtilService } from '../../../services/util_service';
import { TranslateService } from '@ngx-translate/core';
declare var google;

/**
 * Component for address selection using Google map
 */
@IonicPage()
@Component({
    templateUrl: 'address_map.html'
})
export class AddressMap {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    marker: any;
    address;
    lat;
    lng;
    geocoder;
    mapMode;
    autocompleteItems;
    autocomplete;
    service;

    constructor(
        private viewCtrl: ViewController,
        private zone: NgZone,
        private apiService: APIService,
        private util: UtilService,
        private translate: TranslateService
    ) {
        this.service = new google.maps.places.AutocompleteService();
        this.mapMode = true;
        this.address = '';
        this.lat = 0;
        this.lng = 0;
        this.geocoder = new google.maps.Geocoder();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    ionViewWillEnter() {
        this.mapMode = true;
    }

    ionViewDidLoad() {
        // load delivery areas for current city in case we have more than 1 city
        if (this.apiService.getSettings().multiple_restaurants) {
            this.apiService.loadDeliveryAreas(this.apiService.getUserData().city_id).then(() => {
                this.loadMap();
            });
        }
        else {
            this.loadMap();
        }
    }

    geocodeCoords() {
        this.geocoder.geocode({
            location: new google.maps.LatLng(this.lat, this.lng)
        }, (results, status) => {
            if (status == 'OK') {
                this.zone.run(() => {
                    this.address = results[0].formatted_address;
                });
            }
        });
    }
    
    loadMap() {
        this.util.showLoader();
        let latLng = new google.maps.LatLng(55.7469492, 37.62548345);
        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.marker = new google.maps.Marker({
            position: latLng,
            map: this.map
        });
        let delivery_areas = this.apiService.getDeliveryAreas();
        delivery_areas.forEach((area) => {
            let poly = new google.maps.Polygon({
                path: JSON.parse(area.coords),
                strokeColor: '#00FF00',
                strokeOpacity: 0.7,
                fillColor: '#00FF00',
                fillOpacity: 0.4,
                strokeWeight: 4
            });
            poly.setMap(this.map);
        });
        this.map.addListener('dragend', function() {
            this.zone.run(() => {
                this.lat = this.map.getCenter().lat();
                this.lng = this.map.getCenter().lng();
                this.marker.setPosition({ lat: this.lat, lng: this.lng });
                this.geocodeCoords();
            });
        }.bind(this));
        this.map.addListener('drag', function () {
            this.lat = this.map.getCenter().lat();
            this.lng = this.map.getCenter().lng();
            this.marker.setPosition({ lat: this.lat, lng: this.lng });
        }.bind(this));
        navigator.geolocation.getCurrentPosition((position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            let ll = { lat: this.lat, lng: this.lng };
            this.map.setCenter(ll);
            this.marker.setPosition(ll);
            this.geocodeCoords();
            this.util.hideLoader();
        }, () => {
            this.util.hideLoader();
        }, {
            timeout: 30000,
            maximumAge: 600000,
            enableHighAccuracy: true
        });
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    setAddress() {
        let delivery_areas = this.apiService.getDeliveryAreas(),
            in_service_area = false,
            service_area = null,
            latLng = new google.maps.LatLng(this.lat, this.lng);
        delivery_areas.forEach((area) => {
            let poly = new google.maps.Polygon({paths: JSON.parse(area.coords)});
            if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
                in_service_area = true;
                service_area = area;
            }
        });
        if (in_service_area) {
            this.viewCtrl.dismiss({
                address: this.address,
                lat: this.lat,
                lng: this.lng,
                service_area: service_area
            });
        }
        else {
            this.util.alert(this.translate.instant('map.no_service'), '');
        }
    }

    showAddressCompletionWindow() {
        this.mapMode = false;
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
            input: this.autocomplete.query
            // uncomment to apply restrictions
            // componentRestrictions: {
            //     country: 'TH'
            // }
        }, function (predictions, status) {
            me.autocompleteItems = [];
            me.zone.run(function () {
                predictions.forEach(function (prediction) {
                    me.autocompleteItems.push(prediction.description);
                });
            });
        });
    }

    chooseItem(item) {
        let me = this;
        this.geocoder.geocode({
            address: item
        }, (results, status) => {
            if (status == 'OK') {
                this.address = item;
                this.lat = results[0].geometry.location.lat();
                this.lng = results[0].geometry.location.lng();
                let ll = { lat: this.lat, lng: this.lng };
                this.map.setCenter(ll);
                this.marker.setPosition(ll);
                this.setAddress();
                me.zone.run(() => {
                    this.mapMode = true;
                });
            }
        });
    }
}

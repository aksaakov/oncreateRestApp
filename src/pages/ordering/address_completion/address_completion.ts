import { Component, NgZone } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
declare var google;

/**
 * Address autocomplete with google suggestions component
 */
@Component({
    templateUrl: 'address_completion.html'
})
export class AddressCompletion {
    autocompleteItems;
    autocomplete;
    geocoder;
    service;

    constructor(
        private viewCtrl: ViewController,
        private zone: NgZone
    ) {
        this.service = new google.maps.places.AutocompleteService();
        this.geocoder = new google.maps.Geocoder();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({
            input: this.autocomplete.query//,
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
        this.geocoder.geocode({
            address: item
        }, (results, status) => {
            if (status == 'OK') {
                this.viewCtrl.dismiss({
                    address: item,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                });
            }
        });
    }
}

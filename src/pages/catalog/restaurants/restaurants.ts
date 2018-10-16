import { Component } from '@angular/core';
import { APIService } from '../../../services/api_service';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Restaurants list page component
 */
@IonicPage()
@Component({
    templateUrl: 'restaurants.html'
})
export class RestaurantsPage {
    public items;
    public loggedIn = false;

    constructor(
        private nav: NavController,
        private apiService: APIService
    ) {
        this.items = this.apiService.getRestaurants();
        this.loggedIn = this.apiService.isLoggedIn();
    }

    ionViewWillEnter() {
        this.apiService.reloadRestaurants(this.apiService.getUserData().city_id).then(() => {
            this.items = this.apiService.getRestaurants();
        });
    }

    showDetails(restaurant) {
        this.nav.push('CategoriesPage', { restaurant_id: restaurant.id });
    }

}

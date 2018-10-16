import { Component } from '@angular/core';
import { APIService } from '../../../services/api_service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Categories list page component
 */
@IonicPage()
@Component({
    templateUrl: 'categories.html'
})
export class CategoriesPage {
    public categories;
    public sectionId;
    public rootCategory;
    public restaurantId;
    public loggedIn = false;
    public layout = 0;

    constructor(
        private nav: NavController,
        private apiService: APIService,
        private params: NavParams
    ) {
      this.layout = this.apiService.getSettings().categories_layout;
        this.categories = this.getCategories();
        this.sectionId = params.get('id');
        this.restaurantId = params.get('restaurant_id');
        this.rootCategory = params.get('root');
        this.loggedIn = this.apiService.isLoggedIn();
    }

    ionViewWillEnter() {
        this.apiService.reloadCategories(this.restaurantId).then(() => {
            this.categories = this.getCategories();
        });
    }

    getCategories() {
        let result = [];
        this.apiService.getCategories().forEach((c) => {
            if (c.parent_id == this.sectionId) {
                result.push(c);
            }
        });
        return result;
    }

    showDetails(category) {
        if (category.has_children > 0) {
            this.nav.push('CategoriesPage', { id: category.id, root: category });
        }
        else {
            this.nav.push('ProductsPage', { category: category });
        }
    }

}

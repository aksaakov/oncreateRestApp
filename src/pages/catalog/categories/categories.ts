import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { APIService } from '../../../services/api_service';

/**
 * Categories list page component
 */
@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'categories.html'
})

export class CategoriesPage {
    public categories;
    public homepage;
    public sectionId;
    public rootCategory;
    public restaurantId;
    public newsFeed;
    public loggedIn = false;
    public layout = 0;
    public headerSpacing;

    restaurant: string = "about";
    showtext = false;


    constructor(
        private nav: NavController,
        private apiService: APIService,
        private params: NavParams
    ) {
      this.layout = this.apiService.getSettings().categories_layout;
        this.categories = this.getCategories();
        this.homepage = this.getHomepageDetails();
        this.sectionId = params.get('id');
        this.restaurantId = params.get('restaurant_id');
        this.rootCategory = params.get('root');
        this.loggedIn = this.apiService.isLoggedIn();
        this.headerSpacing = 200;
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

    getHomepageDetails() {
        let result = [];
        this.apiService.getHomepageDetails().then((response) => {
            this.homepage = response.json();
            result.push(response);
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
    toggleTextBtn(){
        switch(this.showtext) { 
            case true: { 
                this.showtext = false;
                break; 
             } 
             case false: { 
                this.showtext = true; 
                break; 
             } 
             default: { 
                this.showtext = false;
                break; 
             } 
        }
    }

    openNewsFeed(){
        this.nav.push('NewsFeedPage');
    }

    openNewTab(baseurl, link) {
        window.open(baseurl + link, "_system");
    }
}

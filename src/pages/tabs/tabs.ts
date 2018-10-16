import { Component } from '@angular/core';

import { CartService } from '../../services/cart_service';
import { APIService } from '../../services/api_service';
import {LoyaltyPage} from "../personal/loyalty/loyalty";

/**
 * Tabs primary component
 */
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab0Root: any = 'NewsFeedPage';
    tab1Root: any = 'CategoriesPage';
    tab2Root: any = 'CartPage';
    tab3Root: any = 'OrdersHistoryPage';
    tab4Root: any = 'LoyaltyPage';
    count: number = 0;

    constructor(
        private cart: CartService,
        private apiService: APIService
    ) {
        this.count = cart.getCartCount();
        if (this.apiService.getSettings().multiple_restaurants) {
            this.tab1Root = 'RestaurantsPage';
        }

    	this.cart.itemsCount$.subscribe((v) => {
    		this.count = v;
    	});
    }


}

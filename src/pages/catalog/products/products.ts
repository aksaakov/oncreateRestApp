import { Component } from '@angular/core';
import { APIService } from '../../../services/api_service';
import { CartService } from '../../../services/cart_service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Products list page component
 */
@IonicPage()
@Component({
    templateUrl: 'products.html'
})
export class ProductsPage {
    public products;
    public initialProducts;
    public category;
    public searchQ = '';
    public layout = 1;

    constructor(
        private nav: NavController,
        private apiService: APIService,
        private params: NavParams,
        private cart: CartService
    ) {
      this.layout = this.apiService.getSettings().products_layout;
        this.products = [];
        this.category = params.get('category');
        if (this.category == null) {
            location.href = '/';
        }
    }

    ionViewWillEnter() {
        if (this.category == null) {
            return;
        }
        this.apiService.getProducts(this.category.id).then((response) => {
            this.products = response.json();
            this.initialProducts = response.json();
            for (let i = 0; i < this.products.length; i++) {
                this.products[i].added = this.cart.hasItem(this.products[i]);
            }

        });
    }

    onSearchInput($event) {
        this.products = this.initialProducts.filter(p => {
            return p.name.toLowerCase().indexOf(this.searchQ.toLowerCase()) >= 0;
        });
    }

    addToCart(product) {
        this.cart.addItem(product, 1);
        product.added = true;
    }
}

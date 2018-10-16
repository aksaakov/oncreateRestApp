import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CartService} from '../../../services/cart_service';
import {APIService} from '../../../services/api_service';

/**
 * Cart page component
 */
@IonicPage()
@Component({
  templateUrl: 'cart.html'
})
export class CartPage {
  public items;
  public loggedIn = false;

  constructor(
    private cart: CartService,
    private navCtrl: NavController,
    private apiService: APIService
  ) {
    this.items = cart.getItems();
    cart.itemsCount$.subscribe((v) => {
      this.items == cart.getItems();
    });
    this.loggedIn = this.apiService.isLoggedIn();
  }

  ionViewWillEnter() {
    this.items = this.cart.getItems();
  }

  increaseCart(item): any {
    this.cart.setItemCount(item.product, item.count + 1);
  }

  decreaseCart(item): any {
    if (item.count == 1) {
      this.cart.removeItem(item);
    }
    else {
      this.cart.setItemCount(item.product, item.count - 1);
    }
  }

  showOrderModal() {
    console.log('order');
    this.navCtrl.push('OrderPage');
  }

  cartPrice() {
    let result = 0;
    this.items.forEach((item) => {
      result = result + item.product.price * item.count;
    });
    return result;
  }
}

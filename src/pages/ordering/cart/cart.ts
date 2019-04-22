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

  extrasSum(item) {
    let result = 0;
    if(item.extras != null){
      for (let i = 0; i < item.extras.length; i++) {
        result += +item.extras[i]["extra_price"];
      }
      return result;
    }
  }

  cartPrice() {
    let result = 0;
    this.items.forEach((item) => {
      if(item.extras != null) {
        result = result + item.product.price * item.count + this.extrasSum(item);
      } else {
        result = result + item.product.price * item.count;
      }
    });
    return result;
  }
}

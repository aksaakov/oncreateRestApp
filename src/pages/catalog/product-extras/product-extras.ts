import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { APIService } from '../../../services/api_service';
import {CartService} from "../../../services/cart_service";
import {ProductsPage} from "../products/products";


/**
 * Generated class for the ProductExtrasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-extras',
  templateUrl: 'product-extras.html',
})
export class ProductExtrasPage {
  public extras: any = [];
  public exclusions: any = [];
  public price_sum = 0;
  public productExtras;
  public product;

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private apiService: APIService,
    private cart: CartService,
    private viewCtrl: ViewController,
  ) {
    this.productExtras = navParams.data.productExtras;
    this.product = navParams.data.product;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductExtrasPage');
  }

  addExtra(extra) {
    this.extras.push(extra);
    extra.extra_added = true;

    if(isNaN(extra.price_sum)){
      extra.price_sum = +extra['extra_price'];
    } else {
      extra.price_sum += +extra['extra_price'];
    }

    var multiplier = Math.pow(10, 2 || 0);
    extra.extra_count = extra.price_sum / +extra['extra_price'];
    extra.extra_count = Math.round(extra.extra_count * multiplier) / multiplier;
    extra.price_sum = Math.round(extra.price_sum * multiplier) / multiplier;
  }

  toggleExclusion(exclusion) {
    if(exclusion.exclusion_added == undefined || exclusion.exclusion_added == false) {
      exclusion.exclusion_added = true;
      this.exclusions.push(exclusion);
    } else {
      exclusion.exclusion_added = false;
      this.exclusions.pop(exclusion);
    }
  }

  removeExtra(extra) {
    this.extras.pop(extra);
    extra.price_sum -= extra['extra_price'];
    //to be continued
    if(extra.price_sum < extra['extra_price']){
      extra.extra_added = false;
    }

    var multiplier = Math.pow(10, 2 || 0);
    extra.extra_count = extra.price_sum / +extra['extra_price'];
    extra.extra_count = Math.round(extra.extra_count * multiplier) / multiplier;
    extra.price_sum = Math.round(extra.price_sum * multiplier) / multiplier;
  }

  addToCartWithExtras() {
    this.apiService.getProductExtras(this.product.id).then((response) => {
      this.productExtras = response.json();
        this.cart.addItem(this.product, 1, this.extras, this.exclusions);
      this.nav.parent.extra_added = true;
      this.viewCtrl.dismiss();
    });
  }
}

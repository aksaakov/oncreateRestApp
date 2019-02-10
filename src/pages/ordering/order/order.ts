import {Component} from '@angular/core';
import {CartService} from '../../../services/cart_service';
import {APIService} from "../../../services/api_service";
import {OrderHistoryService} from "../../../services/order_history_service";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {IonicPage, AlertController, ViewController, LoadingController, ModalController} from 'ionic-angular';
import {Stripe} from '@ionic-native/stripe';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from '../../../services/util_service';

/**
 * Make an order page component
 */
@IonicPage()
@Component({
  templateUrl: 'order.html'
})
export class OrderPage {
  public orderData;
  public orderForm;
  public formReady: boolean;
  public deliveryPrice;
  public discountPrice;
  public cTotalPrice = 0;
  public cTaxPrice = 0;
  public cPriceWithTax = 0;
  public cFullPrice = 0;
  public cLoyaltyUsed = 0;
  public userData: any = {};
  public cardForm;

  private stripePushed = false;


  constructor(
    private cart: CartService,
    private apiService: APIService,
    private builder: FormBuilder,
    private alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private historyService: OrderHistoryService,
    private stripe: Stripe,
    private payPal: PayPal,
    private util: UtilService,
    private translate: TranslateService
  ) {
    this.userData = this.apiService.getUserData();
    this.stripe.setPublishableKey(this.apiService.getSettings().stripe_publishable);
    this.deliveryPrice = 0;
    this.orderData = {
      products: cart.getItems()
    };
    this.orderForm = this.builder.group({
      name: [`${this.userData.name}`, Validators.required],
      address: ['', Validators.required],
      phone: ['+44' + `${this.userData.phone}`, [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
      promo_code: [''],
      loyalty: [0, Validators.max(this.userData.loyalty_reward)],
      payment_method: ['cash'],
      comment: ''
    });
    this.cardForm = this.builder.group({
      number: ['', [Validators.required, Validators.maxLength(19), Validators.minLength(19)]],
      expMonth: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1), this.checkExpiry('expMonth')]],
      expYear: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(2), this.checkExpiry('expYear')]],
      cvc: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4), Validators.minLength(3)]]
    });
    this.formReady = true;
    this.discountPrice = null;
  }

  checkExpiry(value): ValidatorFn {

    if (value == 'expYear') {
      return (control: AbstractControl): { [key: string]: any } => {
        let input = control.value;
        let year = (new Date()).getFullYear().toString().substr(-2);
        let isValid = input >= year;
        if (!isValid)
          return {'equalsTo': {isValid}};
        else
          return null;
      }
    } else if (value == 'expMonth') {
      return (control: AbstractControl): { [key: string]: any } => {
        let input = control.value;
        let month = (new Date()).getMonth() + 1;
        let isValid = (input >= month) && input <= 12;
        if (!isValid)
          return {'equalsTo': {isValid}};
        else
          return null;
      }
    }
  }

  showAddressWindow() {
    let modal = this.modalCtrl.create('AddressMap');
    modal.onDidDismiss((data) => {
      if (data && data.address) {
        this.orderForm.controls['address'].setValue(data.address);
        this.orderData.lat = data.lat;
        this.orderData.lng = data.lng;
        this.deliveryPrice = data.service_area.price;
        this.orderData.delivery_area_id = data.service_area.id;
        this.calculatePrices();
      }
    });
    modal.present();
  }

  calculatePrices() {
    this.cFullPrice = this.getFullPrice();
    this.discountPrice = this.cFullPrice;
    this.cTotalPrice = this.cartPrice();
    this.cTaxPrice = this.cartTax();
    this.cPriceWithTax = this.cartWithTax();
  }

  ionViewWillEnter() {
    this.validatePromo(true);
    this.calculatePrices();
  }

  validatePromo(supressAlert?: boolean) {
    if (!this.orderForm.value.promo_code || (this.orderForm.value.promo_code == '')) {
      return;
    }
    let data = {
      code: this.orderForm.value.promo_code,
      products: this.cart.getItems()
    };
    this.apiService.validateDiscount(data).subscribe((data) => {
      if (!data.success) {
        this.discountPrice = null;
        if (!supressAlert) {
          let msg = this.translate.instant('order.promo_not_found');
          if (data.code == 400) {
            msg = this.translate.instant('order.promo_invalid');
          }
          this.util.alert(msg, this.translate.instant('order.error_title'));
        }
      }
      else {
        if (!supressAlert) {
          this.util.alert(this.translate.instant('order.promo_applied'), this.translate.instant('order.success'));
        }
        this.discountPrice = data.new_price;
        this.cPriceWithTax = data.new_price_tax;
        this.cTaxPrice = this.cPriceWithTax - this.discountPrice;
      }
    });
  }

  /**
   * Actual submission of order data to server
   */
  realPlaceOrder() {
    let loading = this.loadingCtrl.create();
    loading.present();
       try
      {
        this.apiService.createOrder(this.orderData).then((response) => {
          let data = response.json(),
        alert = null,
        title = this.translate.instant('order.error_title'),
        message = '';
      if (data.success) {
        title = this.translate.instant('order.success');
        message = this.translate.instant('order.order_placed');
        this.historyService.add(data.order);
      }
      else {
        message = data.errors.join("<br/>");
      }
      alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: [{
          text: 'OK',
          handler: (() => {
            if (data.success) {
              this.cart.clear();
              this.viewCtrl.dismiss();
            }
          }).bind(this)
        }]
      });
      loading.dismiss();
      alert.present();
    }, () => {
      this.util.alert(this.translate.instant('order.general_error'), '');
      loading.dismiss();
    });
      } 
      catch(e)
      {
        console.log(e);
      }
  }

  /**
   * Call PayPal dialog, create a transaction than place an order
   */
  payPayPal() {
    const showPayPalError = () => {
      this.util.alert(this.translate.instant('order.paypal_error'), '');
    }
    this.payPal.init({
      PayPalEnvironmentProduction: this.apiService.getSettings().paypal_client_id,
      PayPalEnvironmentSandbox: this.apiService.getSettings().paypal_client_id
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      // change environment here to start payments processing
      let env = 'PayPalEnvironmentSandbox';
      if (this.apiService.getSettings().paypal_production) {
        env = 'PayPalEnvironmentProduction';
      }
      this.payPal.prepareToRender(env, new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(`${this.cartPrice() + this.deliveryPrice}`, this.apiService.getSettings().paypal_currency, 'Order', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(data => {
          if (data.response && data.response.state == 'approved') {
            this.orderData.paypal_id = data.response.id;
            this.realPlaceOrder();
          }
          else {
            showPayPalError();
          }
        }, showPayPalError);
      }, showPayPalError);
    }, showPayPalError);
  }

  /**
   * Call PayPal dialog, get the card token than place an order
   */
  payStripe() {
    let data = {
      number: this.cardForm.value.number,
      expMonth: this.cardForm.value.expMonth,
      expYear: this.cardForm.value.expYear,
      cvc: this.cardForm.value.cvc
    };
      if (data && data.number) {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.stripe.createCardToken(data)
          .then(token => {
            loading.dismiss();
            this.orderData.stripe_token = token.id;
            this.realPlaceOrder();
          })
          .catch(() => {
            loading.dismiss();
            this.util.alert(this.translate.instant('order.payment_error'), '');
          });
      }

  }

  /**
   * Basic order form submission handler
   * will call corresponding payment method handler
   */
  placeOrder() {
    this.orderData.name = this.orderForm.value.name;
    this.orderData.phone = this.orderForm.value.phone;
    this.orderData.address = this.orderForm.value.address;
    this.orderData.loyalty = this.orderForm.value.loyalty;
    this.orderData.code = this.orderForm.value.promo_code;
    this.orderData.payment_method = this.orderForm.value.payment_method;
    this.orderData.city_id = this.apiService.getUserData().city_id;
    this.orderData.customer_id = this.apiService.getUserData().id;
    this.orderData.restaurant_id = this.cart.getItems()[0].product.restaurant_id;
    this.orderData.comment = this.orderForm.value.comment;

    this.orderData.number = this.cardForm.value.number;
    this.orderData.expMonth = this.cardForm.value.expMonth;
    this.orderData.expYear = this.cardForm.value.expYear;
    this.orderData.cvc = this.cardForm.value.cvc;

    if (this.orderData.payment_method == 'cash') {
      this.realPlaceOrder();
    }
    if (this.orderData.payment_method == 'stripe') {
      this.payStripe();
    }
    if (this.orderData.payment_method == 'paypal') {
      this.payPayPal();
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getFullPrice() {
    let result = 0;
    this.cart.getItems().forEach((item) => {
      result = result + item.product.price * item.count;
    });
    return result;
  }

  cartPrice() {
    if (this.discountPrice) {
      return this.discountPrice;
    }
    return this.getFullPrice();
  }

  cartTax() {
    let result = 0;
    this.cart.getItems().forEach((item) => {
      result = result + item.product.price * item.product.tax_value / 100 * item.count;
    });
    return result;
  }

  cartWithTax() {
    if (this.apiService.getSettings().tax_included) {
      return this.cartPrice() + this.deliveryPrice;
    }
    else {
      return this.cartTax() + this.cartPrice() + this.deliveryPrice;
    }
  }

  useReward() {
    this.cLoyaltyUsed = this.orderForm.controls['loyalty'].value;
    if (this.cLoyaltyUsed > this.cTotalPrice) {
      this.cLoyaltyUsed = this.cTotalPrice;
      this.orderForm.controls['loyalty'].setValue(this.cLoyaltyUsed);
    }
  }

  toggleStripeForm(payMethod) {
    this.stripePushed = payMethod == 'stripe';
  }
}

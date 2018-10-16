import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { APIService } from './api_service';

/**
 * Service handling shopping cart operations
 */
@Injectable()
export class CartService {
    private items;
    private _itemsCount$: Subject<number>;

    constructor(
        private storage: Storage,
        private alertCtrl: AlertController,
        private translate: TranslateService,
        private apiService: APIService
    ) {
        this.items = [];
        this._itemsCount$ = <Subject<number>>new Subject();
    }

    init() {
        this.storage.get('cart').then((v) => {
            if (v) {
                this.items = JSON.parse(v);
                this._itemsCount$.next(this.getCartCount());
            }
        });
    }

    getItems() {
        return this.items;
    }

    clear() {
        this.items.splice(0, this.items.length);
        this.save();
    }

    getCartCount() {
        let count = 0;
        this.items.forEach((item) => {
            count = count + item.count;
        });
        return count;
    }

    doAddItem(product: any, count: number): any {
        let item = null;
        this.items.forEach((cart_item) => {
            if (cart_item.product.id == product.id) {
                item = cart_item;
            }
        });
        if (item == null) {
            this.items.push({
                product: product,
                count: count
            });
        }
        else {
            item.count = item.count + count;
        }
        this.save();
    }

    hasItem(product: any): boolean {
        let result = false;
        this.items.forEach(cart_item => {
            if (cart_item.product.id == product.id) {
                result = true;
            }
        });
        return result;
    }

    addItem(product: any, count: number): any {
        if (this.items.length > 0 && this.apiService.getSettings().multiple_restaurants) {
            if (this.items[0].product.restaurant_id != product.restaurant_id) {
                let confirm = this.alertCtrl.create({
                    title: this.translate.instant('cart.add_from_other_restaurant_title'),
                    message: this.translate.instant('cart.add_from_other_restaurant_text'),
                    buttons: [{
                        text: this.translate.instant('buttons.cancel')
                    }, {
                        text: this.translate.instant('buttons.ok'),
                        handler: () => {
                            this.items = [];
                            this.doAddItem(product, count);
                        }
                    }]
                });
                confirm.present();
            }
            else {
                this.doAddItem(product, count);
            }
        }
        else {
            this.doAddItem(product, count);
        }
    }

    decreaseCount(item): any {
        let ind = this.items.indexOf(item);
        if (ind >= 0) {
            this.items[ind].count = this.items[ind].count - 1;
            if (this.items[ind].count == 0) {
                this.removeItem(item);
            }
            else {
                this.save();
            }
        }
    }

    setItemCount(product: any, count: number): any {
        let item = null;
        this.items.forEach((cart_item) => {
            if (cart_item.product.id == product.id) {
                item = cart_item;
            }
        });
        if (item == null) {
            this.items.push({
                product: product,
                count: count
            });
        }
        else {
            item.count = count;
        }
        this.save();
    }

    removeItem(item): any {
        let ind = this.items.indexOf(item);
        if (ind >= 0) {
            this.items.splice(ind, 1);
            this.save();
        }
    }

    save() {
        this.storage.set('cart', JSON.stringify(this.items)).then(() => {});
        this._itemsCount$.next(this.getCartCount());
    }

    get itemsCount$(): any {
        return this._itemsCount$.asObservable();
    }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { APIService } from './api_service';

/**
 * Service to handle orders history
 * Using server if we have user signup
 * Otherwise stores everything locally
 */
@Injectable()
export class OrderHistoryService {
    private items = [];

    constructor(
        private storage: Storage,
        private apiService: APIService
    ) {
    }

    getItems() {
        return new Promise((resolve, reject) => {
            if (this.apiService.getSettings().signup_required == 1) {
                this.apiService.getOrders().subscribe(v => {
                    this.items = v;
                    resolve(this.items);
                }, () => {
                    reject();
                });
            }
            else {
                this.storage.get('ordersHistory').then(v => {
                    if (v) {
                        this.items = JSON.parse(v);
                        resolve(this.items);
                    }
                    else {
                        reject();
                    }
                }, () => {
                    reject();
                });
            }
        });
    }

    add(order) {
        const addOrder = (order) => {
            this.items.unshift(order);
            this.storage.set('ordersHistory', JSON.stringify(this.items)).then(() => {}, () => {});
        };
        if (this.apiService.getSettings().signup_required != 1) {
            if (this.items.length) {
                addOrder(order);
            }
            else {
                this.storage.get('ordersHistory').then(v => {
                    if (v) {
                        this.items = JSON.parse(v);
                    }
                    addOrder(order);
                }, () => {});
            }
        }
    }
}

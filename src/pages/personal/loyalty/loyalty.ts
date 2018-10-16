import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { APIService } from "../../../services/api_service";

/**
 * Component for profile editing
 */
@IonicPage()
@Component({
  selector: 'loyalty',
  templateUrl: 'loyalty.html',
})
export class LoyaltyPage {
  public userData: any = {};
  public settings: any = {};

  constructor(
    private apiService: APIService
  ) {
  }

  ionViewWillEnter() {
    this.settings = this.apiService.getSettings();
    this.apiService.loadUserData().then(user => {
      this.userData = user;
    });
  }
}

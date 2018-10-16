import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { APIService } from "../../../services/api_service";
import { UtilService } from "../../../services/util_service";

/**
* Component for profile editing
*/
@IonicPage()
@Component({
	selector: 'profile',
	templateUrl: 'profile.html',
})
export class ProfilePage {
	public profileForm: FormGroup;
	public active: boolean;
	public cities = [];
	public showCities = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private builder: FormBuilder,
		private apiService: APIService,
		private util: UtilService
	) {
		this.active = false;
	}

	ionViewWillEnter() {
		this.active = true;
		this.resetForm();
	}

	resetForm() {
		let user = this.apiService.getUserData();
		const rules = {
			email: [user.email, [Validators.required, Validators.email]],
			name: [user.name, [Validators.required]],
			phone: [user.phone, [Validators.required]],
			password: [''],
			password_confirmation: ['']
		};
		if (this.apiService.getSettings().multiple_cities) {
			this.cities = this.apiService.getCities();
			rules['city_id'] = [user.city_id, [Validators.required]];
			this.showCities = true;
		}
		this.profileForm = this.builder.group(rules);
	}

	save() {
		this.util.showLoader();
		this.apiService.saveUserData(this.profileForm.value).then((data: any) => {
			this.util.hideLoader();
			if (!data.success) {
				this.util.alert(data.errors, '');
			}
			else {
				this.resetForm();
				this.navCtrl.pop();
			}
		}, () => {
			this.util.hideLoader();
		});
	}

}

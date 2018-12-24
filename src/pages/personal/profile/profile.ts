import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
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
		this.resetForm(); 
	}

	ionViewWillEnter() {
		this.active = true;
		this.resetForm();
	}

	resetForm() {
		let user = this.apiService.getUserData();
		const rules = {
			name: [user.name, Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z ]*$")])],
			phone: [user.phone, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
			email: [user.email, [Validators.required, Validators.email, Validators.pattern(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))]],
			password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
			password_confirmation: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6),  this.passwordmatch('password')]]
		};
		if (this.apiService.getSettings().multiple_cities) {
			this.cities = this.apiService.getCities();
			rules['city_id'] = [user.city_id, [Validators.required]];
			this.showCities = true;
		}
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

	passwordmatch(field_name): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			let input = control.value;
			let isValid = control.root.value[field_name] == input;
			if (!isValid)
				return {'equalsTo': {isValid}};
			else
				return null;	
		};
	}

	clear(){
		this.profileForm.controls['password_confirmation'].reset();
	}
}

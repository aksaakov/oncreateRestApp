import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { APIService } from '../../../services/api_service';
import { UtilService } from '../../../services/util_service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { TabsPage } from "../../tabs/tabs";
import { PushService } from '../../../services/push_service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

/**
 * Signup page component
 */
@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {
	public loginForm: FormGroup;
	public active: boolean;
	public multipleCities = false;
	public cities:any[] = [];
	public password_confirmation_field:string;

	constructor(
		private apiService: APIService,
		private nav: NavController,
		private builder: FormBuilder,
		private util: UtilService,
		private push: PushService,
		private storage: Storage,
		private translate: TranslateService
	) {
		this.active = true;
		const fields = {
			name: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z ]*$")])],
			phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
			email: ['', [Validators.required, Validators.email, Validators.pattern(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))]],
			password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
			password_confirmation: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6),  this.passwordmatch('password')]]
		};
		this.multipleCities = (this.apiService.getSettings().multiple_cities == 1);
		if (this.multipleCities) {
			fields['city_id'] = [null, Validators.required];
			this.cities = this.apiService.getCities();
		}
		this.loginForm = this.builder.group(fields);
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
		this.loginForm.controls['password_confirmation'].reset();
	}
	
	doSignup() {
		this.util.showLoader();
		let data = JSON.parse(JSON.stringify(this.loginForm.value));
		this.apiService.signup(data).then(response => {
			this.util.hideLoader();
			if (response.success) {
				this.push.init(this.apiService.getSettings().pushwoosh_id);
				this.storage.set('welcomeShown', '1').then(() => {}, () => {});
				this.nav.setRoot(TabsPage);
			}
			else if (response.errors != null) {
				this.util.alert(response.errors, '');
			}
		}, (data) => {
			this.util.hideLoader();
			this.util.alert(this.translate.instant('signup.error'), '');
		});
	}

	login() {
		this.nav.setRoot('LoginPage');
	}
}

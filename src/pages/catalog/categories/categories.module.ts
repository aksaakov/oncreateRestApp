import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({declarations: [
		CategoriesPage
	],
	imports: [
		IonicPageModule.forChild(CategoriesPage),
		TranslateModule.forChild()
	]
})
export class CategoriesPageModule {}

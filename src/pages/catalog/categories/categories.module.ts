import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import { TranslateModule } from '@ngx-translate/core';
import { TruncateModule } from '@yellowspot/ng-truncate';


@NgModule({declarations: [
		CategoriesPage
	],
	imports: [
		TruncateModule,
		IonicPageModule.forChild(CategoriesPage),
		TranslateModule.forChild()
	]
})
export class CategoriesPageModule {}

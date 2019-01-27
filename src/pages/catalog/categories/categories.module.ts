import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import { TranslateModule } from '@ngx-translate/core';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { ShrinkingSegmentHeader } from "../../../components/shrinking-segment-header/shrinking-segment-header";


@NgModule({declarations: [
		CategoriesPage,
    ShrinkingSegmentHeader
	],
	imports: [
		TruncateModule,
		IonicPageModule.forChild(CategoriesPage),
		TranslateModule.forChild()
	]
})
export class CategoriesPageModule {}

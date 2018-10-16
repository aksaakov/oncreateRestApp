import { Pipe, PipeTransform } from '@angular/core';
import { APIService } from '../services/api_service';

/**
 * Ecurrency pipe for displaying money values
 */
@Pipe({ name: 'ecurrency' })
export class ECurrencyPipe implements PipeTransform {
    constructor(
        private apiService: APIService
    ) {

    }

    transform(value: string, args: string[]): any {
        if (!value) return value;
        return this.apiService.getSettings().currency_format.
        	replace(':value', parseFloat(value).toFixed(2));
    }
}
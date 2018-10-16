import {Injectable} from '@angular/core';

/**
 * Service to init device to receive push notifications
 */
@Injectable()
export class PushService {

    constructor() {}

    init(id) {
        let notificationOpenedCallback = (jsonData) => {
        };
        if (window['plugins'] && window['plugins'].OneSignal) {
            window['plugins'].OneSignal.startInit(id)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();
        }
    }

}
import {RxStompConfig} from '@stomp/rx-stomp';
import {environment} from "../../environments/environment";

export const myRxStompConfig: RxStompConfig = {

    brokerURL: environment.wsUrl,
    heartbeatIncoming: 0,           // Typical value     0 - disabled
    heartbeatOutgoing: 20000,       // Typical value 20000 - every 20 seconds
    reconnectDelay: 1000,           // Typical value   500 - 0.5 second

    // Will log diagnostics on console for non-production environment
    debug: (msg: string): void => {
        !environment.production && console.log(new Date(), msg);
    },
    logRawCommunication: !environment.production,

    // Headers
    // Typical keys: login, passcode, host
    // connectHeaders: {
    //     login: 'guest',
    //     passcode: 'guest',
    // },
};

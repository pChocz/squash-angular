import {RxStompConfig} from '@stomp/rx-stomp';
import {environment} from "../../environments/environment";

export const myRxStompConfig: RxStompConfig = {

    brokerURL: environment.wsUrl,
    heartbeatIncoming: 0,           // Typical value     0 - disabled
    heartbeatOutgoing: 20000,       // Typical value 20000 - every 20 seconds
    reconnectDelay: 1000,           // Typical value   500 - 0.5 second

    // Will log diagnostics on console - should be disabled on production
    debug: (msg: string): void => {
        console.log(new Date(), msg);
    },

    logRawCommunication: true,

    // Headers
    // Typical keys: login, passcode, host
    connectHeaders: {
        login: 'guest',
        passcode: 'guest',
    },
};

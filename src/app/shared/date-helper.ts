export abstract class DateHelper {

    static dateTimezoneAgnostic(date: Date): string {
        if (date) {
            let d = new Date(date);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            return d.toISOString().substring(0, 10);
        } else {
            return null;
        }
    }

    static dateUTC(date: string): Date {
        if (date) {
            let d = new Date(date);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
            return d;
        } else {
            return null;
        }
    }

}

import {AbstractControl, ValidatorFn} from "@angular/forms";

export abstract class CustomValidators {

    static noSpecialCharactersValidator(): ValidatorFn {
        const nameRegexp: RegExp = /[!@#$%^&*()+=\[\]{};':"\\|,<>\/?]/;
        return (control: AbstractControl): { [key: string]: any } | null =>
            control.value && !nameRegexp.test(control.value)
                ? null
                : {noSpecialCharacters: true};
    }

}

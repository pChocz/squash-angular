import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

export abstract class CustomValidators {

  static noSpecialCharactersValidator(): ValidatorFn {
    const nameRegexp: RegExp = /[!@#$%^&*()+=\[\]{};':"\\|,<>\/?]/;
    return (control: AbstractControl): { [key: string]: any } | null =>
        control.value && !nameRegexp.test(control.value)
            ? null
            : {noSpecialCharacters: true};
  }

}

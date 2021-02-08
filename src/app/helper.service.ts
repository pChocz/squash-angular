import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable({providedIn: "root"})
export class HelperService {

    languageHasChanged$ = new BehaviorSubject<boolean>(false);

    publishLangChange() {
        console.log("Language change publish")
        this.languageHasChanged$.next(!this.languageHasChanged$.getValue());
    }

}

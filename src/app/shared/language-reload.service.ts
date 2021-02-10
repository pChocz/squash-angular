import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: "root"})
export class LanguageReloadService {

    languageHasChanged$ = new BehaviorSubject<boolean>(false);

    publishLanguageChange() {
        console.log("Language change publish")
        this.languageHasChanged$.next(!this.languageHasChanged$.getValue());
    }

}

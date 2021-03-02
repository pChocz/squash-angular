import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-buy-coffee-view',
    templateUrl: './buy-coffee-view.component.html',
    styleUrls: ['./buy-coffee-view.component.css']
})
export class BuyCoffeeViewComponent implements OnInit {

    loadWidget: Promise<any>;

    constructor() {
    }

    ngOnInit(): void {
        this.loadWidget = new Promise((resolve) => {
            this.loadScript();
            resolve(true);
        });
    }

    public loadScript() {
        let widgetScripts = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
        let node = document.createElement('script');
        node.src = widgetScripts;
        node.type = 'text/javascript';
        node.async = false;
        node.setAttribute('data-id', 'pChocz');
        node.setAttribute('data-description', 'Support me on Buy me a coffee!');
        node.setAttribute('data-message', '');
        node.setAttribute('data-color', '#FFDD00');
        node.setAttribute('data-position', 'Right');
        node.setAttribute('data-x_margin', '18');
        node.setAttribute('data-y_margin', '18');
        document.getElementsByTagName('head')[0].appendChild(node);
    }

}

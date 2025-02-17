import { LightningElement, api } from 'lwc';

export default class AppendHtml extends LightningElement {

    _result = '';
    loaded = false;

    @api
    get result() {
        return this._result;
    }

    set result(data) {
        this._result = data;
        if(this.loaded) {
            this.attachHtml();
        }
    }
    
    renderedCallback() {
        if(this._result && !this.loaded) {
            this.attachHtml();
        }
    }

    attachHtml() {
        const container = this.template.querySelector('.htmlContainer');
        if(container) {
            container.innerHTML = this.result;
            this.loaded = true;
        }
    }
}
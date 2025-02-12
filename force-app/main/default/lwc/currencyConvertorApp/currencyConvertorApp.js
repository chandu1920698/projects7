import { LightningElement } from 'lwc';
import {countryCodeList} from 'c/countryCodeList';
import currencyConvertorAssets from '@salesforce/resourceUrl/currencyConvertorAssets';
export default class CurrencyConvertorApp extends LightningElement {

    countryList = countryCodeList;
    currencyFrom = "INR";
    currencyTo = "USD";

    currencyImage = currencyConvertorAssets + "/currencyConvertorAssets/currency.svg";

    connectedCallback() {
        console.log("this.connectedCallback");
        console.log(this.countryList);
    }
    handleChange(event) {
        const {name, value} = event.target;
        console.log("name -> "+ name);
        console.log("value -> "+ value);
        this[name] = value;
    }
}
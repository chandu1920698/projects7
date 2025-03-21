import { LightningElement, api, track } from 'lwc';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class PortfolioSummary extends LightningElement {

    @api recordId;
    @api objectApiName;

    @track showSpinner;
    @track deviceFromFactor = FORM_FACTOR;

    connectedCallback() {
        if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
            this.showSpinner = true;
        } else  {
            const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                message: 'Event Received',  
                showSpinner : true,
            } });
            this.dispatchEvent(loadDataEvent);
        }
    }

    renderedCallback() {
        const checkDataLoad = () => {
            const outputField = this.template.querySelector('lightning-output-field');
            if (outputField && outputField.innerText.trim() !== '') {
                if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
                    this.showSpinner = false;
                } else  {
                    const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                        message: 'Event Received',  
                        showSpinner : false,
                    } });
                    this.dispatchEvent(loadDataEvent);
                }
                return true; // Data loaded
            }
            return false; // Data not yet loaded
        };

        // Use a periodic check until data is loaded
        const interval = setInterval(() => {
            if (checkDataLoad()) {
                clearInterval(interval); // Stop checking once the data is loaded
            }
        }, 100); // Check every 100 milliseconds
    }
}
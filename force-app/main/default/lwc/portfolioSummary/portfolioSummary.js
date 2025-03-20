import { LightningElement, api, track } from 'lwc';

export default class PortfolioSummary extends LightningElement {

    @api recordId;
    @api objectApiName;

    // @track showSpinner = true;

    connectedCallback() {
        const loadDataEvent = new CustomEvent('loaddata', { detail: { 
            message: 'Event Received',  
            showSpinner : true,
        } });
        this.dispatchEvent(loadDataEvent);
    }

    renderedCallback() {
        // if(this.isLoading == true) {
        //     const outputField = this.template.querySelector('lightning-output-field');
        //     if (outputField && outputField.innerText.trim() !== '') {
        //         // Dispatch the custom event to notify parent that data is loaded
        //         this.dispatchEvent(new CustomEvent('showcomponent'));
        //         this.isLoading = false; // Data loaded
        //     }
        // }
        const checkDataLoad = () => {
            const outputField = this.template.querySelector('lightning-output-field');
            if (outputField && outputField.innerText.trim() !== '') {
                // this.showSpinner = false;
                const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                    message: 'Event Received',  
                    showSpinner : false, 
                } });
                this.dispatchEvent(loadDataEvent);
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
import { LightningElement, wire, api, track } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class PortfolioCertifications extends LightningElement {

    @api recordId;

    @track certificationList = [];
    @track salesforceCertifications = [];
    @track otherCertifications = [];
    @track showSpinner;
    @track deviceFromFactor = FORM_FACTOR;

    @wire(getRelatedListRecords, {
        parentRecordId : '$recordId',
        relatedListId : 'Certifications__r',
        fields : ['Certification__c.Certificate_Image__c',
        'Certification__c.Name',
        'Certification__c.Is_Salesforce_Certification__c',
        'Certification__c.Certification_Url__c']
    })wireGetCertifications({data, error}) {
        if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
            this.showSpinner = true;
        } else  {
            const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                message: 'Event Received',  
                showSpinner : true, 
            } });
            this.dispatchEvent(loadDataEvent);
        }

        if(data) {
            //console.log("data -> " + JSON.stringify(data));

            this.certificationList = data.records.map(item => {
                const {Certificate_Image__c, Name, Is_Salesforce_Certification__c, Certification_Url__c} = item.fields;

                let certId = item.id;
                let certName = this.getFieldData(Name);
                let certIsSalesforceCert = this.getFieldData(Is_Salesforce_Certification__c);
                let certUrl = this.getFieldData(Certification_Url__c);

                const htmlString = this.getFieldData(Certificate_Image__c);

                // Create a DOMParser to parse the string
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');

                // Find the <img> element
                const imgElement = doc.querySelector('img');

                // Get the src attribute value
                let imageUrl = imgElement ? imgElement.getAttribute('src') : null;

                // //console.log('Image src:', imageUrl);

                return {certId, imageUrl, certIsSalesforceCert, certName, certUrl};
            });

            // //console.log("this.certificationList -> " + JSON.stringify(this.certificationList));

            this.salesforceCertifications = this.certificationList.filter(certificate => certificate.certIsSalesforceCert == true);
            this.otherCertifications = this.certificationList.filter(certificate => certificate.certIsSalesforceCert == false);

            // //console.log("this.salesforceCertifications -> " + JSON.stringify(this.salesforceCertifications));
            // //console.log("this.otherCertifications -> " + JSON.stringify(this.otherCertifications));
            if(this.salesforceCertifications.length != 0 || this.salesforceCertifications != 0) {

                if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
                    this.showSpinner = false;
                } else  {
                    const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                        message: 'Event Received',  
                        showSpinner : false, 
                    } });
                    this.dispatchEvent(loadDataEvent);
                }
            }
        } else {
            //console.log("error -> " + JSON.stringify(error));
        }
    };

    getFieldData(data) {
        return data?.displayValue || data?.value;
    }
}
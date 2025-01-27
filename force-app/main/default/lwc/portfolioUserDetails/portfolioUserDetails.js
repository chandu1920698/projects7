import { LightningElement, api, wire } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import { getFieldValue } from 'lightning/uiRecordApi';
import PORTFOLIO_RESUME_URL from '@salesforce/schema/Portfolio__c.Resume_Url__c';

export default class PortfolioUserDetails extends LightningElement {

    @api objectApiName;
    @api recordId;

    handleDownloadResume() {
        window.open(this.resumeUrl, "__blank");
        // https://raw.githubusercontent.com/chandu1920698/chandra-sekhar-reddy-muthumula-resume-sf/517c013cbcd9ae1ff14b530d30c351d2ebac8fab/Feb_2023_SF%20Chandra%20Sekhar%20Reddy%20Muthumula%20Resume.pdf
    }

    @wire(getRecord, {recordId: '$recordId', fields :[PORTFOLIO_RESUME_URL]})
    portfolioData;

    get resumeUrl() {
        return getFieldValue(this.portfolioData?.data, PORTFOLIO_RESUME_URL);
    }
}
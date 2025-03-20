import { LightningElement, api, wire} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import { getFieldValue } from 'lightning/uiRecordApi';
import PORTFOLIO_RANGER from '@salesforce/schema/Portfolio__c.RangerLevel__c';
import PORTFOLIO_BADGE from '@salesforce/schema/Portfolio__c.Badges__c';
import PORTFOLIO_POINTS from '@salesforce/schema/Portfolio__c.Points__c';
import PORTFOLIO_TRAILS from '@salesforce/schema/Portfolio__c.Trails__c';

import PORTFOLIO_OBJECT_API_NAME from '@salesforce/schema/Portfolio__c'

export default class PortfolioUserDetailsAndStatsWrapper extends LightningElement {

    @api recordId //= 'a00WU00000YLqBJYA1';
    objectApiName = PORTFOLIO_OBJECT_API_NAME;

    @wire(getRecord, {recordId: '$recordId', fields :[PORTFOLIO_RANGER, PORTFOLIO_BADGE, PORTFOLIO_POINTS, PORTFOLIO_TRAILS]})
    portfolioData;
    
    // ({data, error}) {
    //     if(data) {
    //         //console.log("Data -> " + JSON.stringify(data));
    //     } else if(error) {
    //         //console.log("error -> " + JSON.stringify(error));
    //     }
    // };

    get rank() {
        return getFieldValue(this.portfolioData?.data, PORTFOLIO_RANGER);
    }

    get badges() {
        return getFieldValue(this.portfolioData?.data, PORTFOLIO_BADGE);
    }

    get points() {
        return getFieldValue(this.portfolioData?.data, PORTFOLIO_POINTS);
    }

    get trails() {
        return getFieldValue(this.portfolioData?.data, PORTFOLIO_TRAILS);
    }
}
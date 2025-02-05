import { LightningElement, wire, api} from 'lwc';
import PORTFOLIO_ASSETS from "@salesforce/resourceUrl/PortfolioAssets";
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import FULL_NAME from '@salesforce/schema/Portfolio__c.FullName__c';
import COMPANY_NAME from '@salesforce/schema/Portfolio__c.CompanyName__c';
import DESIGNATION from '@salesforce/schema/Portfolio__c.Designation__c';
import COMPANY_LOCATION from '@salesforce/schema/Portfolio__c.CompanyLocation__c';
import PROFILE_PIC from '@salesforce/schema/Portfolio__c.Profile_Pic__c';

export default class MyPortfolioBanner extends LightningElement {

    linkedInIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/linkedin.svg";
    leetCodeIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/leetcode.svg";
    youtubeIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/youtube.svg";
    githubIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/github.svg";
    trailheadIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/trailhead1.svg";
    twitterIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/twitter.svg";
    blogIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/blog.svg";

    @api recordId //= 'a00WU00000YLqBJYA1';
    @api linkedInUrl //= "https://www.linkedin.com/in/chandra-sekhar-reddy-muthumula-125797188/";
    @api leetCodeUrl //= "https://leetcode.com/u/chandu20698/";
    @api trailHeadUrl //= "https://www.salesforce.com/trailblazer/cmuthumulareddy";
    @api youtubeUrl //= "https://www.youtube.com/@chandrasekharreddymuthumul8313";
    @api gitHubUrl //= "https://github.com/chandu1920698";
    @api twitterUrl //= "https://github.com/chandu1920698";
    @api blogUrl //= "https://github.com/chandu1920698";

    
    connectedCallback() {
        console.log("this.recordId -> " + JSON.stringify(this.recordId));
    }


    @wire(getRecord, {recordId : '$recordId', fields : [FULL_NAME, COMPANY_LOCATION, COMPANY_NAME, DESIGNATION, PROFILE_PIC]})
    portfolioData;

    // @wire(getRecord, {recordId : '$recordId', fields : [FULL_NAME, COMPANY_LOCATION, COMPANY_NAME, DESIGNATION]})
    // portfolioHandler({data, error}) {
    //     if(data) {
    //         console.log("Data -> " + JSON.stringify(data));
    //     } else if(error) {
    //         console.log("error -> " + JSON.stringify(error));
    //     }
    // }

    get fullName() {
        // console.log("this.portfolioData -> " + JSON.stringify(this.portfolioData));
        return getFieldValue(this.portfolioData?.data, FULL_NAME);
    }
    get companyName() {
        return getFieldValue(this.portfolioData?.data, COMPANY_NAME);
    }
    get desigationName() {
        return getFieldValue(this.portfolioData?.data, DESIGNATION);
    }
    get companyLocation() {
        return getFieldValue(this.portfolioData?.data, COMPANY_LOCATION);
    }

    get profilePicUrl() {

        const htmlString = getFieldValue(this.portfolioData?.data, PROFILE_PIC);

        // Create a DOMParser to parse the string
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Find the <img> element
        const imgElement = doc.querySelector('img');

        // Get the src attribute value
        let imageUrl = imgElement ? imgElement.getAttribute('src') : null;

        return imageUrl;
    }

}
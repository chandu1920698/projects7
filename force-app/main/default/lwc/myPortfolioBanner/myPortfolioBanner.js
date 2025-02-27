import { LightningElement, wire, api, track} from 'lwc';
import PORTFOLIO_ASSETS from "@salesforce/resourceUrl/PortfolioAssets";
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import FULL_NAME from '@salesforce/schema/Portfolio__c.FullName__c';
import COMPANY_NAME from '@salesforce/schema/Portfolio__c.CompanyName__c';
import DESIGNATION from '@salesforce/schema/Portfolio__c.Designation__c';
import TOTAL_VIEWS from '@salesforce/schema/Portfolio__c.Total_Views__c';
import COMPANY_LOCATION from '@salesforce/schema/Portfolio__c.CompanyLocation__c';
import PROFILE_PIC from '@salesforce/schema/Portfolio__c.Profile_Pic__c';
import updatePortfolioTotalViews from '@salesforce/apex/PortfolioController.updatePortfolioTotalViews';

export default class MyPortfolioBanner extends LightningElement {

    linkedInIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/linkedin.svg";
    leetCodeIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/leetcode.svg";
    youtubeIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/youtube.svg";
    githubIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/github.svg";
    trailheadIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/trailhead1.svg";
    twitterIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/twitter.svg";
    blogIcon = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/blog.svg";

    renderedCallbackCheck = false;
    @track totalViewsCounter = 0;
    fullName = '';

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

    applyAnimationDelayToIcons() {
        try {
            const iconsList = this.template.querySelectorAll('.icon');
            let randomNumbers = new Set();
            iconsList.forEach((icon, index) => {
                console.log("icon -> " + JSON.stringify(icon));
                let randomNumber = Math.floor(Math.random() * iconsList.length);
                while(randomNumbers.has(randomNumber)) {
                    randomNumber = Math.floor(Math.random() * iconsList.length);
                }
                randomNumbers.add(randomNumber);
                icon.style = `animation-delay: ${randomNumber/2}s;`;
            });
        } catch (error) {
            console.log("Error icon.style.animationDelay -> " + error);
        }
    }


    @wire(getRecord, {recordId : '$recordId', fields : [FULL_NAME, COMPANY_LOCATION, COMPANY_NAME, DESIGNATION, PROFILE_PIC, TOTAL_VIEWS]})
    portfolioData;

    // @wire(getRecord, {recordId : '$recordId', fields : [FULL_NAME, COMPANY_LOCATION, COMPANY_NAME, DESIGNATION]})
    // portfolioHandler({data, error}) {
    //     if(data) {
    //         console.log("Data -> " + JSON.stringify(data));
    //     } else if(error) {
    //         console.log("error -> " + JSON.stringify(error));
    //     }
    // }

    // get fullName() {
    //     // console.log("this.portfolioData -> " + JSON.stringify(this.portfolioData));
    //     let tempFullName = getFieldValue(this.portfolioData?.data, FULL_NAME);

    //     console.log("tempFullName -> " + JSON.stringify(tempFullName));

    //     if(tempFullName != undefined) {
    //         try {
    //             let subStringLength = 1;
    //             const intervalId = setInterval(() => {
    //                 // console.log(`Interval running... Count: ${count + 1}`);
    //                 if (subStringLength == tempFullName.length) {
    //                     clearInterval(intervalId); // Stops the interval
    //                     console.log("Interval stopped.");
    //                     return tempFullName.substring(0, subStringLength++);
    //                 }
    //             }, 10); 
    //         } catch(error) {
    //             console.log('Error in fullName -> ' + error);
    //         }
    //     }
    // }
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

    renderedCallback() {
        let totalViewsValue = getFieldValue(this.portfolioData?.data, TOTAL_VIEWS);
        // console.log("totalViewsValue -> " + totalViewsValue);

        let tempFullName = getFieldValue(this.portfolioData?.data, FULL_NAME);
        console.log("tempFullName -> " + JSON.stringify(tempFullName));

        if(totalViewsValue != undefined && tempFullName != undefined && !this.renderedCallbackCheck) {
            // Scroll to the top
            const portfolioBanner = this.template.querySelector('.banner');
            console.log('portfolioBanner-> ' + JSON.stringify(portfolioBanner));
            portfolioBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });

            totalViewsValue++;
            this.renderedCallbackCheck = true;
            updatePortfolioTotalViews({recordId : this.recordId})
            .then(response => {
                console.log("updatePortfolioTotalViews -> " + JSON.stringify(response));
            }).catch(error => {
                console.log("Error updatePortfolioTotalViews -> " + error);
            });

            let count = 1;
            const pageImpressionIntervalId = setInterval(() => {
                // console.log(`Interval running... Count: ${count + 1}`);
                this.totalViewsCounter = count++;
                if (this.totalViewsCounter >= totalViewsValue) {
                    clearInterval(pageImpressionIntervalId); // Stops the interval
                    console.log("Interval stopped.");
                    return;
                }
            }, 10); 

            let subStringLength = 1;
            const fullNameIntervalId = setInterval(() => {
                this.fullName = tempFullName.substring(0, subStringLength++);
                if (subStringLength > tempFullName.length) {
                    clearInterval(fullNameIntervalId); // Stops the interval
                    console.log("Interval stopped.");
                    return;
                }
            }, 50); 

            this.applyAnimationDelayToIcons();
        }
    }
}
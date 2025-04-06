import { LightningElement, wire, api, track } from "lwc";
import { gql, graphql } from "lightning/uiGraphQLApi";

import {getRecord} from 'lightning/uiRecordApi';
import FULL_NAME from '@salesforce/schema/Portfolio__c.FullName__c';
import COMPANY_NAME from '@salesforce/schema/Portfolio__c.CompanyName__c';
import DESIGNATION from '@salesforce/schema/Portfolio__c.Designation__c';
import TOTAL_VIEWS from '@salesforce/schema/Portfolio__c.Total_Views__c';
import COMPANY_LOCATION from '@salesforce/schema/Portfolio__c.CompanyLocation__c';
import PROFILE_PIC from '@salesforce/schema/Portfolio__c.Profile_Pic__c';
import ABOUT_ME from '@salesforce/schema/Portfolio__c.About_Me__c';

import BADGES from '@salesforce/schema/Portfolio__c.Badges__c';
import POINTS from '@salesforce/schema/Portfolio__c.Points__c';
import RANGER_LEVEL from '@salesforce/schema/Portfolio__c.RangerLevel__c';
import TRAILS from '@salesforce/schema/Portfolio__c.Trails__c';

import RESUME_URL from '@salesforce/schema/Portfolio__c.Resume_Url__c';
import EMAIL from '@salesforce/schema/Portfolio__c.Email__c';
import MOBILE_NUMBER from '@salesforce/schema/Portfolio__c.MobileNumber__c';
import ADDRESS from '@salesforce/schema/Portfolio__c.Address__c';


export default class MyPortfolioComponentsWrapper extends LightningElement {
    @api recordId;
    recordData;
    error;

    @api linkedInUrl //= "https://www.linkedin.com/in/chandra-sekhar-reddy-muthumula-125797188/";
    @api leetCodeUrl //= "https://leetcode.com/u/chandu20698/";
    @api trailHeadUrl //= "https://www.salesforce.com/trailblazer/cmuthumulareddy";
    @api youtubeUrl //= "https://www.youtube.com/@chandrasekharreddymuthumul8313";
    @api gitHubUrl //= "https://github.com/chandu1920698";
    @api twitterUrl //= "https://github.com/chandu1920698";
    @api blogUrl //= "https://github.com/chandu1920698";

    get variables() {
        return {
            portfolioRecordId: this.recordId
        };
    }

    @track portfolioBannerData;

    // @wire(graphql, {
    //     query: gql`
    //     query getPortfolioRecord($portfolioRecordId: ID!) {
    //         uiapi {
    //             query {
    //                 Portfolio__c(where: { Id: { eq: $portfolioRecordId } }) {
    //                     edges {
    //                         node {
    //                             Id
    //                             Name { value }
    //                             FullName__c { value}
    //                             About_Me__c { value }
    //                             Address__c { value }
    //                             Badges__c { value }
    //                             CompanyLocation__c { value }
    //                             Designation__c { value }
    //                             CompanyName__c { value }
    //                             Email__c { value }
    //                             MobileNumber__c { value }
    //                             Points__c { value }
    //                             RangerLevel__c { value }
    //                             Resume_Url__c { value }
    //                             Summary__c { value }
    //                             Total_Views__c { value }
    //                             Trails__c { value }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     `,
    //     variables: '$variables'
    // })
    // wiredResult({ data, errors }) {
    //     if (data) {
    //         const nodes = data?.uiapi?.query?.Portfolio__c?.edges || [];
    //         this.recordData = nodes.length > 0 ? nodes[0].node : null;

    //         this.portfolioBannerData = {
    //             companyName : this.recordData?.CompanyName__c,
    //             companyLocation : this.recordData?.CompanyLocation__c,
    //             fullName : this.recordData?.FullName__c,
    //             companyLocation : this.recordData?.CompanyLocation__c,
    //             aboutMe : this.recordData?.About_Me__c,
    //             pageImpressions : this.recordData?.Total_Views__c,
    //             designationName : this.recordData?.Designation__c,
    //         };

            // this.portfolioUserPersonalDetailsData= {
            //     resumeUrl : this.recordData?.Resume_Url__c,
            //     email : this.recordData?.Email__c,
            //     mobileNumber : this.recordData?.MobileNumber__c,
            //     address : this.recordData?.Address__c,
            // }

            // this.portfolioUserTrailHeadStatsData = {
            //     badges : this.recordData?.Badges__c,
            //     points : this.recordData?.Points__c,
            //     trails : this.recordData?.Trails__c,
            //     rangerLevel : this.recordData?.RangerLevel__c,
            // }

            // console.log('this.portfolioUserTrailHeadStatsData -> ', JSON.stringify(this.portfolioUserTrailHeadStatsData));
            // console.log('this.portfolioUserPersonalDetailsData -> ', JSON.stringify(this.portfolioUserPersonalDetailsData));


    //         this.error = undefined;
    //     } else if (errors) {
    //         this.error = errors;
    //         this.recordData = undefined;
    //         console.error('GraphQL Errors:', errors);
    //     }
    // }


    @wire(getRecord, {recordId : '$recordId', fields : [FULL_NAME, COMPANY_LOCATION, COMPANY_NAME, DESIGNATION, PROFILE_PIC, TOTAL_VIEWS, ABOUT_ME, RESUME_URL, EMAIL, MOBILE_NUMBER, ADDRESS, BADGES, POINTS, RANGER_LEVEL, TRAILS]})
    portfolioData ({data, error}) {
        if(data) {
            this.recordData = data;
            this.error = undefined;
            let fields = data.fields;
            console.log('this.recordData -> ', JSON.stringify(this.recordData));
            console.log('fields -> ', JSON.stringify(fields));
            console.log('companyName -> ' + fields['CompanyName__c'].value);
            this.portfolioBannerData = {
                companyName : fields['CompanyName__c'].value,
                companyLocation : fields['CompanyLocation__c'].value,
                fullName : fields['FullName__c'].value,
                aboutMe : fields['About_Me__c'].value,
                pageImpressions : fields['Total_Views__c'].value,
                designationName : fields['Designation__c'].value,
            };

            this.portfolioUserPersonalDetailsData = {
                resumeUrl : fields['Resume_Url__c'].value,
                email : fields['Email__c'].value,
                mobileNumber : fields['MobileNumber__c'].value,
                address : fields['Address__c'].value,
            }

            this.portfolioUserTrailHeadStatsData = {
                badges : fields['Badges__c'].value,
                points : fields['Points__c'].value,
                trails : fields['Trails__c'].value,
                rangerLevel : fields['RangerLevel__c'].value,
            }

            console.log('this.portfolioBannerData -> ', JSON.stringify(this.portfolioBannerData));
            console.log('this.portfolioUserPersonalDetailsData -> ', JSON.stringify(this.portfolioUserPersonalDetailsData));
            console.log('this.portfolioUserTrailHeadStatsData -> ', JSON.stringify(this.portfolioUserTrailHeadStatsData));

        } else if(error) {
            this.error = error;
            this.recordData = undefined;
            console.error('this.error -> ', JSON.stringify(this.error));
        }

    }
}
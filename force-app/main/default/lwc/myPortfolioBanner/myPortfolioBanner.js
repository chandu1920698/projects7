import { LightningElement, wire, api, track} from 'lwc';
// import PORTFOLIO_ASSETS from "@salesforce/resourceUrl/PortfolioAssets";
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import FULL_NAME from '@salesforce/schema/Portfolio__c.FullName__c';
import COMPANY_NAME from '@salesforce/schema/Portfolio__c.CompanyName__c';
import DESIGNATION from '@salesforce/schema/Portfolio__c.Designation__c';
import TOTAL_VIEWS from '@salesforce/schema/Portfolio__c.Total_Views__c';
import COMPANY_LOCATION from '@salesforce/schema/Portfolio__c.CompanyLocation__c';
import PROFILE_PIC from '@salesforce/schema/Portfolio__c.Profile_Pic__c';
import ABOUT_ME from '@salesforce/schema/Portfolio__c.About_Me__c';
import updatePortfolioTotalViews from '@salesforce/apex/PortfolioController.updatePortfolioTotalViews';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class MyPortfolioBanner extends LightningElement {

    linkedInIcon; //PORTFOLIO_ASSETS + "/PortfolioAssets/Social/linkedin.svg";
    leetCodeIcon // = PORTFOLIO_ASSETS + "/PortfolioAssets/Social/leetcode.svg";
    youtubeIcon //= PORTFOLIO_ASSETS + "/PortfolioAssets/Social/youtube.svg";
    githubIcon //= PORTFOLIO_ASSETS + "/PortfolioAssets/Social/github.svg";
    trailheadIcon //= PORTFOLIO_ASSETS + "/PortfolioAssets/Social/trailhead1.svg";
    twitterIcon //= PORTFOLIO_ASSETS + "/PortfolioAssets/Social/twitter.svg";
    blogIcon //= PORTFOLIO_ASSETS + "/PortfolioAssets/Social/blog.svg";
    profilePic; 
    isDesktop = FORM_FACTOR == 'Large' ? true : false;

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
        //console.log("this.recordId -> " + JSON.stringify(this.recordId));
        
        this.applyAnimationDelayToIcons();
        
        const profilePicTag = document.querySelector("meta[name='profilePic']");
        if (profilePicTag) {
            this.profilePic = profilePicTag.content;
        }

        const linkedInIconTag = document.querySelector("meta[name='linkedInIcon']");
        if (linkedInIconTag) {
            this.linkedInIcon = linkedInIconTag.content;
        }

        const leetCodeIconTag = document.querySelector("meta[name='leetCodeIcon']");
        if (leetCodeIconTag) {
            this.leetCodeIcon = leetCodeIconTag.content;
        }

        const youtubeIconTag = document.querySelector("meta[name='youtubeIcon']");
        if (youtubeIconTag) {
            this.youtubeIcon = youtubeIconTag.content;
        }

        const githubIconTag = document.querySelector("meta[name='githubIcon']");
        if (githubIconTag) {
            this.githubIcon = githubIconTag.content;
        }

        const trailheadIconTag = document.querySelector("meta[name='trailheadIcon']");
        if (trailheadIconTag) {
            this.trailheadIcon = trailheadIconTag.content;
        }

        const twitterIconTag = document.querySelector("meta[name='twitterIcon']");
        if (twitterIconTag) {
            this.twitterIcon = linkedInIconTag.content;
        }

        const blogIconTag = document.querySelector("meta[name='blogIcon']");
        if (blogIconTag) {
            this.blogIcon = blogIconTag.content;
        }
        
    }

    get bannerCss() {
        if(this.isDesktop) {
            return 'banner-desktop';
        } else {
            return 'banner-mobile';
        }
    }

    get profilePicCss() {
        if(this.isDesktop) {
            return 'profile-pic-desktop';
        } else {
            return 'profile-pic-mobile';
        }
    }

    get iconCss() {
        if(this.isDesktop) {
            return 'icon-desktop';
        } else {
            return 'icon-mobile';
        }
    }

    get totalViewsClassCss() {
        if(this.isDesktop) {
            return 'totalViewsClass-desktop';
        } else {
            return 'totalViewsClass-mobile';
        }
    }

    get nameCss() {
        if(this.isDesktop) {
            return 'name-desktop';
        } else {
            return 'name-mobile';
        }
    }

    get detailsCss() {
        return 'slds-col details';
    }

    applyAnimationDelayToIcons() {
        try {
            // console.log("this.iconCss -> "+  this.iconCss);
            const iconsList = this.template.querySelectorAll('.' + this.iconCss);
            if(iconsList?.length > 0) {
                if(this.isDesktop) {
                    iconsList.forEach((icon, index) => {
                        icon.style = `animation-delay: ${(iconsList.length - index)/2}s;`;
                    });
                } else {
                    let randomNumbers = new Set();
                    iconsList.forEach((icon, index) => {
                        let randomNumber = Math.floor(Math.random() * iconsList.length);
                        while(randomNumbers.has(randomNumber)) {
                            randomNumber = Math.floor(Math.random() * iconsList.length);
                        }
                        randomNumbers.add(randomNumber);
                        icon.style = `animation-delay: ${randomNumber/2}s;`;
                    });
                }
            }
        } catch (error) {
            //console.log("Error icon.style.animationDelay -> " + error);
        }
    }


    @wire(getRecord, {recordId : '$recordId', fields : [FULL_NAME, COMPANY_LOCATION, COMPANY_NAME, DESIGNATION, PROFILE_PIC, TOTAL_VIEWS, ABOUT_ME]})
    portfolioData;

    get companyName() {
        return getFieldValue(this.portfolioData?.data, COMPANY_NAME);
    }
    get desigationName() {
        return getFieldValue(this.portfolioData?.data, DESIGNATION);
    }
    get companyLocation() {
        return getFieldValue(this.portfolioData?.data, COMPANY_LOCATION);
    }

    get aboutMe() {
        let aboutMeFieldValue = getFieldValue(this.portfolioData?.data, ABOUT_ME);
        if(this.isDesktop) {
            let aboutMeHtml = this.template.querySelector('.about-me');
            if(aboutMeHtml) {
                aboutMeHtml.innerHTML = aboutMeFieldValue;
            }
        } else {
            let aboutMeHtml = this.template.querySelector('.about-me-mobile');
            if(aboutMeHtml) {
                aboutMeHtml.innerHTML = aboutMeFieldValue;
            }
        }
        
        return '';
    }

    get profilePicUrl() {

        // const htmlString = getFieldValue(this.portfolioData?.data, PROFILE_PIC);

        // // Create a DOMParser to parse the string
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(htmlString, 'text/html');

        // // Find the <img> element
        // const imgElement = doc.querySelector('img');

        // // Get the src attribute value
        // let imageUrl = imgElement ? imgElement.getAttribute('src') : null;

        // return imageUrl;

        return this.profilePic
    }

    renderedCallback() {
        let totalViewsValue = getFieldValue(this.portfolioData?.data, TOTAL_VIEWS);
        // //console.log("totalViewsValue -> " + totalViewsValue);

        let tempFullName = getFieldValue(this.portfolioData?.data, FULL_NAME);
        // //console.log("tempFullName -> " + JSON.stringify(tempFullName));

        let aboutMeFieldValue = getFieldValue(this.portfolioData?.data, ABOUT_ME);
        // //console.log("aboutMeFieldValue -> " + JSON.stringify(aboutMeFieldValue));

        if(totalViewsValue != undefined && tempFullName != undefined && aboutMeFieldValue != undefined && !this.renderedCallbackCheck) {

            if(this.isDesktop) {
                const aboutMeHtml = this.template.querySelector('.about-me');
                aboutMeHtml.innerHTML = aboutMeFieldValue;
            } else {
                const aboutMeHtml = this.template.querySelector('.about-me-mobile');
                aboutMeHtml.innerHTML = aboutMeFieldValue;
            }
            
            // Scroll to the top
            const portfolioBanner = this.template.querySelector(this.bannerCss);
            // //console.log('portfolioBanner-> ' + JSON.stringify(portfolioBanner));
            if(portfolioBanner) {
                portfolioBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            totalViewsValue++;
            this.renderedCallbackCheck = true;
            updatePortfolioTotalViews({recordId : this.recordId})
            .then(response => {
                //console.log("updatePortfolioTotalViews -> " + JSON.stringify(response));
            }).catch(error => {
                //console.log("Error updatePortfolioTotalViews -> " + error);
            });

            let count = 1;
            const pageImpressionIntervalId = setInterval(() => {
                // //console.log(`Interval running... Count: ${count + 1}`);
                this.totalViewsCounter = count++;
                if (this.totalViewsCounter >= totalViewsValue) {
                    clearInterval(pageImpressionIntervalId); // Stops the interval
                    //console.log("Interval stopped.");
                    return;
                }
            }, 10); 

            let subStringLength = 1;
            const fullNameIntervalId = setInterval(() => {
                this.fullName = tempFullName.substring(0, subStringLength++);
                if (subStringLength > tempFullName.length) {
                    clearInterval(fullNameIntervalId); // Stops the interval
                    //console.log("Interval stopped.");
                    return;
                }
            }, 50); 
            this.applyAnimationDelayToIcons();
        }
    }
}
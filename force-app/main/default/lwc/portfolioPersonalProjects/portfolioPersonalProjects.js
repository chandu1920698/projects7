import { LightningElement, api, wire, track } from 'lwc';
import getProjects from '@salesforce/apex/ProjectsControllerClass.getProjects';

export default class PortfolioPersonalProjects extends LightningElement {

    @api recordId;

    @track showSpinner = true;
    @track projectDetails;

    connectedCallback() {
        this.showSpinner = true;
        console.log('connectedCallback PortfolioPersonalProjects this.recordId => ' + JSON.stringify(this.recordId));
        this.getProjectDetails();
        
    }

    getProjectDetails() {
        getProjects({portfolioRecordId : this.recordId})
        .then(data => {
            // console.log('ppp projectDetails => ' + JSON.stringify(data));

            this.projectDetails = [];
            data.forEach(project => {
                let projectId = project.Id;
                let projectName = project.Name;
                let projectDescription = project.Description__c;
                let projectWebsite = project.Project_Website__c;
                let imageUrls = [];
                let projectImage1 = this.getProjectImage(project.Image_1__c);
                if(projectImage1 != null) {
                    imageUrls.push(projectImage1);
                }
                let projectImage2 = this.getProjectImage(project.Image_2__c);
                if(projectImage2 != null) {
                    imageUrls.push(projectImage2);
                }
                let projectImage3 = this.getProjectImage(project.Image_3__c);
                if(projectImage3 != null) {
                    imageUrls.push(projectImage3);
                }
                let projectImage4 = this.getProjectImage(project.Image_4__c);
                if(projectImage4 != null) {
                    imageUrls.push(projectImage4);
                }
                let projectImage5 = this.getProjectImage(project.Image_5__c);
                if(projectImage5 != null) {
                    imageUrls.push(projectImage5);
                }
                let isDisableAutoScroll = imageUrls.length > 1 ? false : true; 
                this.projectDetails.push({projectId, projectName, projectDescription, projectWebsite, imageUrls, isDisableAutoScroll});
            });

            console.log("this.projectDetails -> " + JSON.stringify(this.projectDetails));

            if(this.projectDetails.length != 0) {
                this.showSpinner = false;
            }
        }).catch(error => {
            console.log("connectedCallback PortfolioPersonalProjects this.recordId => " + JSON(error));
        });
    }

    getProjectImage(imageData) {

        // Create a DOMParser to parse the string
        const parser = new DOMParser();
        const doc = parser.parseFromString(imageData, 'text/html');

        // Find the <img> element
        const imgElement = doc.querySelector('img');

        // Get the src attribute value
        let imageUrl = imgElement ? imgElement.getAttribute('src') : null;

        console.log('Image src:', imageUrl);

        return imageUrl;

    }

    getFieldData(data) {
        return data?.displayValue || data?.value;
    }
}
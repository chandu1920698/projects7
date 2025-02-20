import { LightningElement, api, wire, track } from 'lwc';
import getProjectDetails from '@salesforce/apex/ProjectsControllerClass.getProjectDetails';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class PortfolioPersonalProjects extends LightningElement {

    @api recordId;

    @track showSpinner = true;
    @track projectDetails;

    connectedCallback() {
        console.log('ppp recordId => ' + JSON.stringify(this.recordId));
    }

    @wire(getRelatedListRecords, {
        parentRecordId : '$recordId',
        relatedListId : 'Projects__r',
        fields : ['Project__c.Project_Website__c',
        'Project__c.Name',
        'Project__c.Description__c',
        'Project__c.CreatedDate',
        'Project__c.Image_1__c',
        'Project__c.Image_2__c',
        'Project__c.Image_3__c',
        'Project__c.Image_4__c',
        'Project__c.Image_5__c']
    })wireProjectDetails({data, error}) {
        this.showSpinner = true;
        if(data) {
            console.log("data projectDetails -> " + JSON.stringify(data));
            this.projectDetails = data.records.map(item => {
                const {Name, Project_Website__c, Description__c, CreatedDate, Image_1__c, Image_2__c, Image_3__c, Image_4__c, Image_5__c} = item.fields;

                let projectId = item.id;
                let projectName = this.getFieldData(Name);
                let projectDescription = this.getFieldData(Description__c);
                let projectWebsite = this.getFieldData(Project_Website__c);
                let createdDateTime = this.getDateTime(this.getFieldData(CreatedDate));
                let imageUrls = [];
                let projectImage1 = this.getProjectImage(this.getFieldData(Image_1__c));
                if(projectImage1 != null) {
                    imageUrls.push(projectImage1);
                }
                let projectImage2 = this.getProjectImage(this.getFieldData(Image_2__c));
                if(projectImage2 != null) {
                    imageUrls.push(projectImage2);
                }
                let projectImage3 = this.getProjectImage(this.getFieldData(Image_3__c));
                if(projectImage3 != null) {
                    imageUrls.push(projectImage3);
                }
                let projectImage4 = this.getProjectImage(this.getFieldData(Image_4__c));
                if(projectImage4 != null) {
                    imageUrls.push(projectImage4);
                }
                let projectImage5 = this.getProjectImage(this.getFieldData(Image_5__c));
                if(projectImage5 != null) {
                    imageUrls.push(projectImage5);
                }

                return {projectId, projectName, projectDescription, projectWebsite, imageUrls, createdDateTime};
            });

            this.projectDetails.sort((a, b) => new Date(a.createdDateTime) - new Date(b.createdDateTime));

            this.projectDetails = this.projectDetails.reverse();
            
            console.log("this.projectDetails -> " + JSON.stringify(this.projectDetails));

            if(this.projectDetails.length != 0) {
                this.showSpinner = false;
            }
        } else {
            console.log("error -> " + JSON.stringify(error));
        }
    };

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

    getDateTime(dateString) {
        // Split the string into parts
        const [datePart, timePart] = dateString.split(", ");
        const [day, month, year] = datePart.split("/");
        const [time, modifier] = timePart.split(" ");
        let [hours, minutes] = time.split(":");

        // Convert 12-hour format to 24-hour format
        if (modifier === "pm" && hours !== "12") {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === "am" && hours === "12") {
            hours = "00"; // Midnight case
        }

        // Create the Date object
        const dateObject = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

        console.log(dateObject);

        return dateObject;
    }
}
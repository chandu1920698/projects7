import { LightningElement, api, wire, track } from 'lwc';
import getProjectDetails from '@salesforce/apex/ProjectsControllerClass.getProjectDetails';

export default class PortfolioPersonalProjects extends LightningElement {

    @api recordId;

    @track showSpinner = true;
    @track projectDetails;
    // @track wireProjectsDetails;

    connectedCallback() {
        console.log('ppp recordId => ' + JSON.stringify(this.recordId));
    }

    @wire(getProjectDetails, {portfolioRecordId : '$recordId'})
    wireProjectsDetails({data, error}) {
        this.showSpinner = true;
        if(data) {
            console.log('data - PortfolioPersonalProjects=> ' + JSON.stringify(data));
            this.projectDetails = data;
            if(this.projectDetails) {
                this.showSpinner = false;
            }
        } else {
            console.log('error =>  PortfolioPersonalProjects - > ' + JSON.stringify(error));
        }
        
    }
}
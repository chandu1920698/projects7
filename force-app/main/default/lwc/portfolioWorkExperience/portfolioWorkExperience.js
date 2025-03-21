import { LightningElement, wire, api, track } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class PortfolioWorkExperience extends LightningElement {

    @api recordId;
    @api isEducation;

    @track workExperienceList = [];
    @track isDesktop = true;

    showSpinner;
    deviceFromFactor = FORM_FACTOR;

    connectedCallback() {
        if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
            this.isDesktop = true;
            this.showSpinner = true;
        } else  {
            const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                message: 'Event Received',  
                showSpinner : true, 
            } });
            this.dispatchEvent(loadDataEvent);
        }
    }
    @wire(getRelatedListRecords, {
        parentRecordId : '$recordId',
        relatedListId : 'WorkExperience__r',
        fields : ['Work_Experience__c.Start_Date__c',
        'Work_Experience__c.Job_End_Date__c',
        'Work_Experience__c.Role__c',
        'Work_Experience__c.Work_Location__c',
        'Work_Experience__c.Is_Current__c',
        'Work_Experience__c.Description__c',
        'Work_Experience__c.Company_Name__c',
        'Work_Experience__c.Is_Education__c'],
        // WHERE : "Work_Experience__c.Is_Education__c : $isEducation",
    })workExperienceHandler({data, error}) {
        // this.showSpinner = true;
        const loadDataEvent = new CustomEvent('loaddata', { detail: { 
            message: 'Event Received',  
            showSpinner : true, 
        } });
        this.dispatchEvent(loadDataEvent);
        
        if(data) {
            //console.log("data -> " + JSON.stringify(data));
            this.formatWorkExperience(data);
        } else {
            //console.log("error -> " + JSON.stringify(error));
        }
    };

    formatWorkExperience(data) {
        this.workExperienceList = [...data.records].reverse().map(item => {
            let id = item.id;
            const {Start_Date__c, Job_End_Date__c, Role__c, Work_Location__c, Is_Current__c, Description__c, Company_Name__c, Is_Education__c} = item.fields;
            
            let jobIsEducation = this.getFieldValue(Is_Education__c);
            let jobStartDate = this.getFieldValue(Start_Date__c);
            let jobEndDate = this.getFieldValue(Job_End_Date__c);
            let jobRole = this.getFieldValue(Role__c);
            let jobWorkLocation = this.getFieldValue(Work_Location__c);
            let jobIsCurrent = this.getFieldValue(Is_Current__c);
            let jobDescription = this.getFieldValue(Description__c);
            let jobCompnayName = this.getFieldValue(Company_Name__c);
            let isShowExperience = true;
            let dropdownClass = 'slds-timeline__item_expandable slds-timeline__item_task slds-is-open';

            // //console.log(jobIsEducation + " -> " + this.isEducation);

            if(jobIsEducation.toString() == this.isEducation.toString()) {
                return {id, jobCompnayName, jobDescription, jobStartDate, jobRole, jobEndDate, jobWorkLocation, jobIsCurrent, isShowExperience, dropdownClass};
            }
        });
        
        this.workExperienceList = this.workExperienceList.filter(item => item != null);
        //console.log("this.workExperienceList -> " + JSON.stringify(this.workExperienceList));
        if(this.workExperienceList.length > 0) {
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
    }

    handleShowExperienceClick(event) {
        let experienceId = event.currentTarget.dataset.id;
        //console.log("experienceId => " + event.currentTarget.dataset.id);
        
        this.workExperienceList.forEach(experience => {
            if(experience.id == experienceId) {
                experience.isShowExperience = !experience.isShowExperience;
                if(experience.isShowExperience) {
                    experience.dropdownClass = 'slds-timeline__item_expandable slds-timeline__item_task slds-is-open';
                } else {
                    experience.dropdownClass = 'slds-timeline__item_expandable slds-timeline__item_task slds-is-close';
                }
            }
        });
    }

    getFieldValue(data) {
        return data?.displayValue || data?.value;
    }

}
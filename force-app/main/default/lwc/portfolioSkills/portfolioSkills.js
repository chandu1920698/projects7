import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import TECH_SKILLS_FIELD from '@salesforce/schema/Portfolio__c.Technical_Skills__c';
import SOFT_SKILLS_FIELD from '@salesforce/schema/Portfolio__c.Soft_Skills__c';
import SOFTWARE_FIELD from '@salesforce/schema/Portfolio__c.Software_Tools__c';
import METHODOLOGIES_FIELD from '@salesforce/schema/Portfolio__c.Software_Development_Methodologies__c';

export default class PortfolioSkills extends LightningElement {
    @api recordId;

    techSkills = [];
    softSkills =[];
    methodologies=[];
    toolsSkills = [];

    @track showSpinner = true;

    @wire(getRecord, {
        recordId:'$recordId',
        fields:[TECH_SKILLS_FIELD, SOFT_SKILLS_FIELD, SOFTWARE_FIELD, METHODOLOGIES_FIELD]
    })skillHandler({data, error}){
        this.showSpinner = true;
        if(data){
            console.log("Skills Data", JSON.stringify(data));
            this.formatSkills(data);
        }
        if(error){
            console.error("Skills error", error);
        }
    }

    formatSkills(data){
        const {Soft_Skills__c, Software_Development_Methodologies__c, Software_Tools__c,Technical_Skills__c} = data.fields;
        this.techSkills = Technical_Skills__c?.value ? Technical_Skills__c.value.split(','):null;
        this.softSkills = Soft_Skills__c?.value ? Soft_Skills__c.value.split(','):null;
        this.methodologies = Software_Development_Methodologies__c?.value ? Software_Development_Methodologies__c.value.split(','): null;
        this.toolsSkills = Software_Tools__c?.value ? Software_Tools__c.value.split(','):null;

        console.log("this.techSkills -> ", JSON.stringify(this.techSkills));
        console.log("this.softSkills -> ", JSON.stringify(this.softSkills));
        console.log("this.methodologies -> ", JSON.stringify(this.methodologies));
        console.log("this.toolsSkills -> ", JSON.stringify(this.toolsSkills));

        if(this.techSkills || this.softSkills || this.methodologies || this.toolsSkills) {
            this.showSpinner = false;
        }
        
    }
}
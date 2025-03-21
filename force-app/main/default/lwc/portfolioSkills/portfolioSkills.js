import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import TECH_SKILLS from '@salesforce/schema/Portfolio__c.Technical_Skills__c';
import SOFT_SKILLS from '@salesforce/schema/Portfolio__c.Soft_Skills__c';
import SOFTWARE from '@salesforce/schema/Portfolio__c.Software_Tools__c';
import METHODOLOGIES from '@salesforce/schema/Portfolio__c.Software_Development_Methodologies__c';
import DATABASE from '@salesforce/schema/Portfolio__c.Databases__c';
import OPERATING_SYSTEMS from '@salesforce/schema/Portfolio__c.Operating_Systems__c';
import PROGRAMMING_LANGUAGES from '@salesforce/schema/Portfolio__c.Programming_Languages__c';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class PortfolioSkills extends LightningElement {
    @api recordId;

    techSkills = [];
    softSkills =[];
    methodologies=[];
    toolsSkills = [];
    databases = [];
    operatingSystems = [];
    programmingLanguages = [];
    showSpinner;
    deviceFromFactor = FORM_FACTOR;

    @wire(getRecord, {
        recordId:'$recordId',
        fields:[TECH_SKILLS, SOFT_SKILLS, SOFTWARE, METHODOLOGIES, DATABASE, OPERATING_SYSTEMS, PROGRAMMING_LANGUAGES]
    })skillHandler({data, error}){
        if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
            this.showSpinner = true;
        } else  {
            const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                message: 'Event Received',  
                showSpinner : true, 
            } });
            this.dispatchEvent(loadDataEvent);
        }

        if(data){
            //console.log("Skills Data", JSON.stringify(data));
            this.formatSkills(data);
        }
        if(error){
            console.error("Skills error", error);
        }
    }

    formatSkills(data){
        const {Soft_Skills__c, Software_Development_Methodologies__c, Software_Tools__c,Technical_Skills__c, Databases__c, Operating_Systems__c, Programming_Languages__c} = data.fields;
        this.techSkills = Technical_Skills__c?.value ? Technical_Skills__c.value.split(','):null;
        this.softSkills = Soft_Skills__c?.value ? Soft_Skills__c.value.split(','):null;
        this.methodologies = Software_Development_Methodologies__c?.value ? Software_Development_Methodologies__c.value.split(','): null;
        this.toolsSkills = Software_Tools__c?.value ? Software_Tools__c.value.split(','):null;
        this.databases = Databases__c?.value ? Databases__c.value.split(','):null;
        this.operatingSystems = Operating_Systems__c?.value ? Operating_Systems__c.value.split(','):null;
        this.programmingLanguages = Programming_Languages__c?.value ? Programming_Languages__c.value.split(','):null;

        //console.log("this.techSkills -> ", JSON.stringify(this.techSkills));
        //console.log("this.softSkills -> ", JSON.stringify(this.softSkills));
        //console.log("this.methodologies -> ", JSON.stringify(this.methodologies));
        //console.log("this.toolsSkills -> ", JSON.stringify(this.toolsSkills));
        //console.log("this.databases -> ", JSON.stringify(this.databases));
        //console.log("this.operatingSystems -> ", JSON.stringify(this.operatingSystems));
        //console.log("this.programmingLanguages -> ", JSON.stringify(this.programmingLanguages));

        if(this.techSkills || this.softSkills || this.methodologies || this.toolsSkills || this.databases || this.operatingSystems || this.programmingLanguages) {

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
}
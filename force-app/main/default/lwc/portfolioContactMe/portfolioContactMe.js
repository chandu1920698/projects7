import { LightningElement,api, track, wire } from 'lwc';
import sendEmail from '@salesforce/apex/ContactMeSendEmailController.sendMail';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ToastContainer from 'lightning/toastContainer';
import CONTACT_ME from '@salesforce/schema/Portfolio__c.Contact_Me__c';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class PortfolioContactMe extends LightningElement {

    @api recordId;

    name = '';
    email = '';
    message = '';
    isButtonDisabled = true;
    isShowModal = false;
    messageHeaderGreeting = '';
    @track isRendered = false;
    showSpinner;
    deviceFromFactor = FORM_FACTOR;
    isDesktop = false;

    @track contactMeHtmlInfo;

    get centerContainerCss() {
        if(this.deviceFromFactor == 'Large' || this.deviceFromFactor == 'Medium') {
            return 'center-container-desktop';
        } else {    
            return 'center-container-mobile';
        }
    }

    get contactMeTextCss() {
        if(this.deviceFromFactor == 'Large' || this.deviceFromFactor == 'Medium') {
            return 'contact-me-text-desktop';
        } else {    
            return 'contact-me-text-mobile';
        }
    }

    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.toastPosition = 'top-center';
        // console.log("this.recordId -> " + this.recordId);

        if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
            this.showSpinner = true;
            this.isDesktop = true;
        } else  {
            const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                message: 'Event Received',  
                showSpinner : true, 
            } });
            this.dispatchEvent(loadDataEvent);
        } 
    }

    @wire(getRecord, {
            recordId:'$recordId',
            fields:[CONTACT_ME]
        })getContactMe({data, error}){   
            if(data){
                this.contactMeHtmlInfo = getFieldValue(data, CONTACT_ME);
                // console.log("this.contactMeHtmlInfo  -> " +  JSON.stringify(this.contactMeHtmlInfo));

                if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
                    this.showSpinner = false;
                } else  {
                    const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                        message: 'Event Received',  
                        showSpinner : false, 
                    } });
                    this.dispatchEvent(loadDataEvent);
                }

                const contactMeHtml = this.template.querySelector('.' + this.contactMeTextCss);
                if(this.contactMeHtmlInfo != undefined && contactMeHtml) {
                    // console.log("renderedCallback this.contactMeHtmlInfo -> " + JSON.stringify(this.contactMeHtmlInfo));
                    // console.log("renderedCallback -> " + JSON.stringify(contactMeHtml));
                    contactMeHtml.innerHTML = this.contactMeHtmlInfo;
                }
            }
            if(error){
                console.error("Skills error", error);
            }
        }

    handleInputChange(event) {
        //console.log("Inside handleInputChange");
        //console.log("event.target -> " + event.target);
        if(event.target) {
            if(event.target.name === "name") {
                this.name = event.target.value;
            } else if(event.target.name === "email") {
                this.email = event.target.value;
            } else if(event.target.name === "message") {
                this.message = event.target.value;
            }
        }
        //console.log("this.name -> " + this.name); 
        //console.log("this.email -> " + this.email);
        //console.log("this.message -> " + this.message);

        if((this.name && this.email && this.message)) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    handleSendMessage(event) {
        event.preventDefault();
        //console.log("this.name -> " + this.name); 
        //console.log("this.email -> " + this.email);
        //console.log("this.message -> " + this.message);
        this.sendEmailHelper();
    }


    sendEmailHelper() {
        // this.showToastMessage('Sending Email...', 'info', 'Your email is being sent.');
        sendEmail({name: this.name, email: this.email, body: this.message, recordId: this.recordId})
        .then(responses => {
            //console.log("sendEmail response -> " + JSON.stringify(responses));
            responses.forEach(response => {
                if(response.isSuccess && response.message.includes('Email sent successfully.')) {
                    this.showToastMessage('Email Sent', 'success', response.message);
                    this.messageHeaderGreeting = `Hello, ${this.name}`;
                    this.isShowModal = true;
                } else if(response.isSuccess == false && response.message.includes('FIELD_CUSTOM_VALIDATION_EXCEPTION')) {
                    this.messageHeaderGreeting = `Hello again, ${this.name}`;
                    this.isShowModal = true;
                } else if(response.isSuccess == false && response.message.includes('SINGLE_EMAIL_LIMIT_EXCEEDED')) {
                    this.showToastMessage('Case created', 'Success', 'A case has been created. We will contact you soon !');
                    this.messageHeaderGreeting = `Hello, ${this.name}`;
                    this.isShowModal = true;
                }
            });
            this.clearDataHelper();
        });
    }

    showToastMessage(title, variant, message) {
        this.dispatchEvent(new ShowToastEvent({
            title : title,
            message : message,
            variant : variant,
            mode: 'dismissable'
        }));
    }

    clearDataHelper() {
        this.name = '';
        this.message = '';
        this.email = '';
    }

    handleModalClose() {
        this.isShowModal = false;
    }

    renderedCallback() {
        if(!this.isRendered && this.contactMeHtmlInfo != undefined) {
            this.isRendered = true;
            if(this.deviceFromFactor == "Large" || this.deviceFromFactor == "Medium") {
                this.showSpinner = false;
            } else  {
                const loadDataEvent = new CustomEvent('loaddata', { detail: { 
                    message: 'Event Received',  
                    showSpinner : false, 
                } });
                this.dispatchEvent(loadDataEvent);
            }

            const contactMeHtml = this.template.querySelector('.' + this.contactMeTextCss);
            if(this.contactMeHtmlInfo != undefined && contactMeHtml) {
                console.log("renderedCallback this.contactMeHtmlInfo -> " + JSON.stringify(this.contactMeHtmlInfo));
                console.log("renderedCallback -> " + JSON.stringify(contactMeHtml));
                contactMeHtml.innerHTML = this.contactMeHtmlInfo;
            }   
        }
    }
}
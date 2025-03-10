import { LightningElement,api } from 'lwc';
import sendEmail from '@salesforce/apex/ContactMeSendEmailController.sendMail';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ToastContainer from 'lightning/toastContainer';

export default class PortfolioContactMe extends LightningElement {

    @api recordId;

    name = '';
    email = '';
    message = '';
    isButtonDisabled = true;
    isShowModal = false;
    messageHeaderGreeting = '';

    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.toastPosition = 'top-center';
    }

    handleInputChange(event) {
        console.log("Inside handleInputChange");
        console.log("event.target -> " + event.target);
        if(event.target) {
            if(event.target.name === "name") {
                this.name = event.target.value;
            } else if(event.target.name === "email") {
                this.email = event.target.value;
            } else if(event.target.name === "message") {
                this.message = event.target.value;
            }
        }
        console.log("this.name -> " + this.name); 
        console.log("this.email -> " + this.email);
        console.log("this.message -> " + this.message);

        if((this.name && this.email && this.message)) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    handleSendMessage(event) {
        event.preventDefault();
        console.log("this.name -> " + this.name); 
        console.log("this.email -> " + this.email);
        console.log("this.message -> " + this.message);
        this.sendEmailHelper();
    }


    sendEmailHelper() {
        // this.showToastMessage('Sending Email...', 'info', 'Your email is being sent.');
        sendEmail({name: this.name, email: this.email, body: this.message, recordId: this.recordId})
        .then(responses => {
            console.log("sendEmail response -> " + JSON.stringify(responses));
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
}
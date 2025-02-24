import { LightningElement, track, api } from 'lwc';

const PORTFOLIO_OBJECT_API_NAME = 'Portfolio__c';

export default class PortfolioPathWrapper extends LightningElement {

    @api recordId;

    objectApiName = PORTFOLIO_OBJECT_API_NAME;
    currentPathIndex = 0;

    @track showSpinner = true;
    @track sldsPathValues = [
        {
            pItem : {
                label : 'About Me' // Summary renamed as About Me
            },
            classList : 'slds-path__item slds-is-current slds-is-active', 
            pathIndex : 0
        },
        {
            pItem : {
                label : 'Personal Projects',
            },
            classList : 'slds-path__item slds-is-incomplete',
            pathIndex : 1
        },
        {
            pItem : {
                label : 'Work Experience',
            },
            classList : 'slds-path__item slds-is-incomplete',
            pathIndex : 2
        },
        {
            pItem : {
                label : 'Skills',
            },
            classList : 'slds-path__item slds-is-incomplete',
            pathIndex : 3
        },
        {
            pItem : {
                label : 'Education',
            },
            classList : 'slds-path__item slds-is-incomplete',
            pathIndex : 4
        },
        {
            pItem : {
                label : 'Certifications',
            },
            classList : 'slds-path__item slds-is-incomplete',
            pathIndex : 5
        },
        {
            pItem : {
                label : 'Others',
            },
            classList : 'slds-path__item slds-is-incomplete',
            pathIndex : 6
        },
    ];

    showSummary = true;
    showPersonalProjects = false;
    showWorkExperience = false;
    showSkills = false;
    showEducation = false;
    showCertifications = false;
    showOthers = false;

    handleSelectPath(event) {
        console.log("event -> "+ JSON.stringify(event));
        console.log(JSON.stringify(event.currentTarget));
        console.log(JSON.stringify(event.currentTarget?.dataset.value));

        const scrollToElement = this.template.querySelector('.portfolioWrapperClass');
        scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if(event.currentTarget?.dataset.value) {
            this.handleSelectPathHelperToUpdatePathValues(event.currentTarget?.dataset.value);
            this.handleSelectPathHelperToShowTemplates(event.currentTarget?.dataset.value);

            this.sldsPathValues.forEach(path => {
                if(event.currentTarget?.dataset.value == path.pItem.label) {
                    this.currentPathIndex = path.pathIndex;
                }
            });
        }
    }

    handleNextPrevClick(event) {
        console.log("event -> "+ JSON.stringify(event));
        console.log(JSON.stringify(event.target));
        console.log(JSON.stringify(event.target?.dataset.buttonType));

        if(event.target?.dataset.buttonType == 'next') {
            this.currentPathIndex = (this.currentPathIndex + 1) % (this.sldsPathValues.length);
        } else if (event.target?.dataset.buttonType == 'previous') {
            this.currentPathIndex = (this.sldsPathValues.length + this.currentPathIndex - 1) % (this.sldsPathValues.length);
        }

        let selctedPathName;

        this.sldsPathValues.forEach(path => {
            if(path.pathIndex == this.currentPathIndex) {
                selctedPathName = path.pItem.label;
            }
        });

        this.handleSelectPathHelperToUpdatePathValues(selctedPathName);
        this.handleSelectPathHelperToShowTemplates(selctedPathName);

        const scrollToElement = this.template.querySelector('.portfolioWrapperClass');
        scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    handleSelectPathHelperToUpdatePathValues(selectedtabName) {
        this.sldsPathValues.forEach(path => {
            if(selectedtabName == path.pItem.label) {
                // path.classList = 'slds-path__item slds-is-incomplete';
                // setTimeout(() => {
                //     path.classList = 'slds-path__item slds-is-current slds-is-active';
                // }, 0); // Force reflow
                path.classList = 'slds-path__item slds-is-current slds-is-active';
            } else {
                path.classList = 'slds-path__item slds-is-incomplete';
            }
        });
    }

    handleSelectPathHelperToShowTemplates(selectedtabName) {
        if(selectedtabName) {
            this.showSummary = false;
            this.showPersonalProjects = false;
            this.showWorkExperience = false;
            this.showSkills = false;
            this.showEducation = false;
            this.showCertifications = false;
            this.showOthers = false;

            if(selectedtabName == 'About Me') {
                this.showSummary = true;
            } else if(selectedtabName == 'Personal Projects') {
                this.showPersonalProjects = true;
            } else if(selectedtabName == 'Work Experience') {
                this.showWorkExperience = true;
            } else if(selectedtabName == 'Skills') {
                this.showSkills = true;
            } else if(selectedtabName == 'Education') {
                this.showEducation = true;
            } else if(selectedtabName == 'Certifications') {
                this.showCertifications = true;
            } else if(selectedtabName == 'Others') {
                this.showOthers = true;
            }
        }
    }

    handleMobileAccordiantabClick(event) {
        let pathLabel = event.currentTarget.label;
        let className = event.currentTarget.classList.value.split(' ')[0];
        if(pathLabel) {
            this.handleSelectPathHelperToShowTemplates(pathLabel);
            this.sldsPathValues.forEach(path => {
                if(pathLabel == path.pItem.label) {
                    this.currentPathIndex = path.pathIndex;
                }
            });

            setTimeout(() => { 
                const scrollToElement = this.template.querySelector(`.${className}`);
                console.log("scrollToElement -> " + JSON.stringify(scrollToElement));
                scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1000);
        }
    }
}
import { LightningElement, api, wire} from 'lwc';

export default class PortfolioUserDetailsAndStatsWrapper extends LightningElement {

    @api recordId;
    @api portfolioWrapperComponentDataTrailhead;
    @api portfolioWrapperComponentDataPersonal;

    get rank() {
        // return getFieldValue(this.portfolioData?.data, PORTFOLIO_RANGER);
        // GrapgQL
        // return this.portfolioWrapperComponentDataTrailhead?.rangerLevel?.value;
        return this.portfolioWrapperComponentDataTrailhead?.rangerLevel;
    }

    get badges() {
        // return getFieldValue(this.portfolioData?.data, PORTFOLIO_BADGE);
        // GrapgQL
        // return this.portfolioWrapperComponentDataTrailhead?.badges?.value;    
        return this.portfolioWrapperComponentDataTrailhead?.badges; 
    }

    get points() {
        // return getFieldValue(this.portfolioData?.data, PORTFOLIO_POINTS);
        // GrapgQL
        // return this.portfolioWrapperComponentDataTrailhead?.points?.value;    
        return this.portfolioWrapperComponentDataTrailhead?.points;
    }

    get trails() {
        // return getFieldValue(this.portfolioData?.data, PORTFOLIO_TRAILS);
        // GrapgQL
        // return this.portfolioWrapperComponentDataTrailhead?.trails?.value;   
        
        return this.portfolioWrapperComponentDataTrailhead?.trails;
    }

    get email() {
        // return this.portfolioWrapperComponentDataPersonal?.email?.value;
        return this.portfolioWrapperComponentDataPersonal?.email;
    }
    get mobileNumber() {
        // return this.portfolioWrapperComponentDataPersonal?.mobileNumber?.value;
        return this.portfolioWrapperComponentDataPersonal?.mobileNumber;
    }
    get address() {
        // return this.portfolioWrapperComponentDataPersonal?.address?.value;
        return this.portfolioWrapperComponentDataPersonal?.address;
    }
    get resumeUrl() {
        // return this.portfolioWrapperComponentDataPersonal?.resumeUrl?.value;
        return this.portfolioWrapperComponentDataPersonal?.resumeUrl;
    }
}
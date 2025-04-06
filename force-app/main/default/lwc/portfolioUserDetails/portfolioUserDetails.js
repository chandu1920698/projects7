import { LightningElement, api, wire } from 'lwc';
export default class PortfolioUserDetails extends LightningElement {

    @api email;
    @api mobileNumber;
    @api address;
    @api resumeUrl;

    handleDownloadResume() {
        window.open(this.resumeUrl, "__blank");
        // https://raw.githubusercontent.com/chandu1920698/chandra-sekhar-reddy-muthumula-resume-sf/517c013cbcd9ae1ff14b530d30c351d2ebac8fab/Feb_2023_SF%20Chandra%20Sekhar%20Reddy%20Muthumula%20Resume.pdf
    }
}
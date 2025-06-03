import { LightningElement, api } from 'lwc';
import PORTFOLIO_ASSETS from "@salesforce/resourceUrl/PortfolioAssets";
export default class PortfolioUserStats extends LightningElement {

    
    @api badges; //= '609+';
    @api points; // = '308,200+';
    @api trails; // = '68+';
    @api rank;

    // trailheadRankImg //= PORTFOLIO_ASSETS + "/PortfolioAssets/Ranks/Ranger.png";
    // renderedCallback() {
    //     if(this.rank) {
    //         let url = PORTFOLIO_ASSETS + "/PortfolioAssets/Ranks/" + this.rank + ".png";
    //         this.trailheadRankImg = url;

    //         //console.log("this.trailheadRankImg -> "+ this.trailheadRankImg)
    //     }
    // }

    get trailheadRankImg() {
        //console.log(" this.rank -> "+  this.rank);
        return PORTFOLIO_ASSETS + "/PortfolioAssets/Ranks/" + this.rank + ".png";
    }
}
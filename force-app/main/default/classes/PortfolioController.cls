public without sharing class PortfolioController {
    public PortfolioController() {

    }

    @AuraEnabled
    public static Boolean updatePortfolioTotalViews(String recordId){
        try {
            if(!String.isBlank(recordId)) {
                Portfolio__c portfolio = [SELECT Id, Total_Views__c FROM Portfolio__c WHERE Id =: recordId];
                if(portfolio != null) {
                    Decimal totalViews = portfolio.Total_Views__c + 1; 
                    portfolio.Total_Views__c = totalViews;
                    update portfolio;
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException('e.getMessage() -> ' + e.getMessage());
        }
    }
}
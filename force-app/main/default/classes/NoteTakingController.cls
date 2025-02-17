public without sharing class NoteTakingController {
    public NoteTakingController() {

    }

    @AuraEnabled
    public static boolean createNoteRecord(String title, String description) {
        try {
            if(!String.isBlank(title)) {
                My_Note__c note = new My_Note__c(Name = title, Note_Description__c	= description);
                insert note;
                return true;
            }   
            return false;
        } catch (Exception ex) {
            throw new AuraHandledException('Exception -> ' + ex.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<My_Note__c> getNotes(){
        try {
            List<My_Note__c> noteList = [SELECT ID, Name, Note_Description__c, LastModifiedDate FROM My_Note__c ORDER BY LastModifiedDate DESC];
            return noteList;
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean updateNoteRecord(String title, String description, String noteId) {
        try {
            if(!String.isBlank(noteId)) {
                My_Note__c noteRecord = [SELECT Id, Name, Note_Description__c FROM My_Note__c WHERE Id = :noteId];
                noteRecord.Name = title;
                noteRecord.Note_Description__c = description;
                update noteRecord;
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean deleteNoteRecord(String noteId) {
        try {
            if(!String.isBlank(noteId)) {
                My_Note__c noteRecord = [SELECT Id, Name, Note_Description__c FROM My_Note__c WHERE Id = :noteId];
                delete noteRecord;
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
public without sharing class ContactTriggerHelper {
    public static Boolean isTriggerExecuted = false;

    public ContactTriggerHelper() {
        
    }
    
    public static void beforeInsert(List<Contact> newContacts) {
        if(newContacts.size() > 0) {
            List<String> newEmailList = new List<String>();
            
            for(Contact newContact : newContacts) {
                if(newContact.Email != null) {
                    newEmailList.add(newContact.Email);
                }
            }
            
            Map<String, Contact> existingContactMap = new Map<String, Contact>();
            if(newEmailList.size() != 0) {
                for(Contact existingContact : [SELECT Id, Email FROM Contact WHERE Email =: newEmailList]) {
                   existingContactMap.put(existingContact.Email.toString(), existingContact);
                }   
            }

            for(Contact newContact : newContacts) {
                if(newContact.Email != null && existingContactMap.containsKey(newContact.Email)) {
                    newContact.addError('A contact with this email already exists. Please use a different email.');
                }
            }
        }
    }
}
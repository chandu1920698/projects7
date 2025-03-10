public without sharing class ContactMeSendEmailController {
    
    public ContactMeSendEmailController() { }

    @AuraEnabled
    public static List<EmailStatusWrapper> sendMail(String name, String email, String body, String recordId) {
        List<EmailStatusWrapper> emailStatusWrapperList = new List<EmailStatusWrapper>();

        if (String.isBlank(recordId)) {
            emailStatusWrapperList.add(new EmailStatusWrapper(false, 'Record ID is missing. Email not sent.'));
            return emailStatusWrapperList;
        }

        // Fetch email from Portfolio__c while enforcing security
        Portfolio__c portfolioRecord = [
            SELECT Email__c, OwnerId
            FROM Portfolio__c 
            WHERE Id = :recordId 
            LIMIT 1
        ];
        try {
            if (String.isBlank(portfolioRecord.Email__c)) {
                emailStatusWrapperList.add(new EmailStatusWrapper(false, 'No email found for the given record ID.'));
                return emailStatusWrapperList;
            }

            // Create an email message object
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(new List<String>{ portfolioRecord.Email__c, email });
            mail.setSubject('New Message from ' + '\'' + name + '\'' + ' via Your Portfolio Contact Form');
            mail.setHtmlBody(body.toString());

            // Send the email
            Messaging.SendEmailResult[] results = Messaging.sendEmail(
                new Messaging.SingleEmailMessage[]{ mail }
            );
            
            if (results[0].isSuccess()) {
                emailStatusWrapperList.add(new EmailStatusWrapper(true, 'Email sent successfully.'));
            } else {
                emailStatusWrapperList.add(new EmailStatusWrapper(false, 'Email delivery failed.'));
            }

        } catch (Exception ex) {
            System.debug('sendMail -> Exception: ' + ex.getMessage());
            emailStatusWrapperList.add(new EmailStatusWrapper(false, ex.getMessage()));
        }
        emailStatusWrapperList.add(ContactMeSendEmailController.createContact(name, email, body, portfolioRecord.OwnerId));
		return emailStatusWrapperList;
    }
    
    public static EmailStatusWrapper createContact(String name, String email, String body, Id portfolioOwnerId) {
        EmailStatusWrapper emailWrapper;
        try {
            Contact capturedContact =  new Contact();
            capturedContact.LastName = name;
            if(name.split(' ').size() > 1) {
                capturedContact.FirstName = name.split(' ').get(0);
                capturedContact.LastName = name.split(' ').get(1);
            }
            capturedContact.Email = email;
            insert capturedContact;

            ContactMeSendEmailController.createCase(name, body.stripHtmlTags(), email, capturedContact.Id, portfolioOwnerId);

        } catch (Exception ex) {
            emailWrapper = new EmailStatusWrapper(false, ex.getMessage());
            Contact con = [SELECT Id, Name, Email FROM Contact WHERE Email =: email];
            ContactMeSendEmailController.createCase(name, body.stripHtmlTags(), email, con.Id, portfolioOwnerId);
        }
        
        return emailWrapper;
    }

    // @AuraEnabled(cacheable=false)
    public static String createCase(String subject, String description, String contactEmail, Id contactId, Id ownerId) {
        try {
            // Create Case record
            Case newCase = new Case(
                Subject = subject,
                Description = description,
                ContactId = contactId,
                Origin = 'Web', // You can customize this
                Status = 'New', // Default status
                SuppliedEmail = contactEmail, // Stores the email from guest user
                OwnerId = OwnerId
            );

            insert newCase;
            return 'Success: Your case has been created. We will contact you soon!';
        } catch (Exception e) {
            return 'Error: ' + e.getMessage();
        }
    }

    public class EmailStatusWrapper {
        @AuraEnabled
        public Boolean isSuccess { get; set; }
        @AuraEnabled
        public String message { get; set; }
        
        public EmailStatusWrapper() {}

        public EmailStatusWrapper(Boolean isSuccess, String message) {
            this.isSuccess = isSuccess;
            this.message = message;
        }
    }
}
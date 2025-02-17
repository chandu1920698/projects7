public with sharing class ProjectsControllerClass {
    
    public static final String MY_DOMAIN_URL = URL.getOrgDomainUrl().toExternalForm();
    
    public ProjectsControllerClass() {
        // Constructor
    }

    @AuraEnabled(cacheable=true)
    public static List<ProjectDetailsWrapper> getProjectDetails(String portfolioRecordId) {
        List<ProjectDetailsWrapper> projectDetails = new List<ProjectDetailsWrapper>();
        System.debug('portfolioRecordId -> ' + portfolioRecordId);
        try {
            if (portfolioRecordId != null && portfolioRecordId != '') {
                // Step 1: Fetch Projects
                List<Project__c> projectsList = [
                    SELECT Id, Name, Project_Website__c, Description__c 
                    FROM Project__c 
                    WHERE Portfolio__c = :portfolioRecordId ORDER BY CreatedDate DESC
                ];

                if (!projectsList.isEmpty()) {
                    // Step 2: Fetch ContentDocumentLinks
                    Set<Id> projectIds = new Map<Id, Project__c>(projectsList).keySet();
                    List<ContentDocumentLink> contentDocLinks = [
                        SELECT ContentDocumentId, LinkedEntityId 
                        FROM ContentDocumentLink 
                        WHERE LinkedEntityId IN :projectIds
                    ];

                    // Step 3: Fetch ContentVersions
                    if (!contentDocLinks.isEmpty()) {
                        Set<Id> contentDocumentIds = new Set<Id>();
                        for (ContentDocumentLink contentDocLink : contentDocLinks) {
                            contentDocumentIds.add(contentDocLink.ContentDocumentId);
                        }

                        Map<Id, List<ContentVersion>> contentVersionMap = new Map<Id, List<ContentVersion>>();
                        List<ContentVersion> versions = [
                            SELECT Id, ContentDocumentId, FileExtension, FileType, Title 
                            FROM ContentVersion 
                            WHERE ContentDocumentId IN :contentDocumentIds AND IsLatest = TRUE
                        ];

                        for (ContentVersion version : versions) {
                            if (!contentVersionMap.containsKey(version.ContentDocumentId)) {
                                contentVersionMap.put(version.ContentDocumentId, new List<ContentVersion>());
                            }
                            contentVersionMap.get(version.ContentDocumentId).add(version);
                        }

                        // Step 4: Map ContentVersions to Projects and Populate Wrapper
                        Map<Id, List<Id>> projectToContentDocs = new Map<Id, List<Id>>();
                        for (ContentDocumentLink link : contentDocLinks) {
                            if (!projectToContentDocs.containsKey(link.LinkedEntityId)) {
                                projectToContentDocs.put(link.LinkedEntityId, new List<Id>());
                            }
                            projectToContentDocs.get(link.LinkedEntityId).add(link.ContentDocumentId);
                        }

                        for (Project__c project : projectsList) {
                            List<String> imageUrls = new List<String>();
                            if (projectToContentDocs.containsKey(project.Id)) {
                                for (Id contentDocId : projectToContentDocs.get(project.Id)) {
                                    if (contentVersionMap.containsKey(contentDocId)) {
                                        for (ContentVersion version : contentVersionMap.get(contentDocId)) {
                                            //imageUrls.add(MY_DOMAIN_URL + '/sfc/servlet.shepherd/version/download/' + version.Id);
                                            imageUrls.add(MY_DOMAIN_URL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_JPG&versionId=' + version.Id);
                                        }
                                    }
                                }
                            }

                            projectDetails.add(new ProjectDetailsWrapper(
                                project.Name, 
                                project.Project_Website__c, 
                                project.Description__c, 
                                imageUrls
                            ));
                        }
                    }
                }
            }  
        } catch (Exception ex) {
            System.debug('Exception -> ' + ex.getMessage());
        }
        return projectDetails;
    }
    
    public class ProjectDetailsWrapper {
        @AuraEnabled
        public String projectName { get; set; }
        @AuraEnabled
        public String projectWebsiteUrl { get; set; }
        @AuraEnabled
        public String projectDescription { get; set; }
        @AuraEnabled
        public List<String> projectImageUrls { get; set; }

        public ProjectDetailsWrapper(String projectName, String projectWebsiteUrl, String projectDescription, List<String> projectImageUrls) {
            this.projectName = projectName;
            this.projectWebsiteUrl = projectWebsiteUrl;
            this.projectDescription = projectDescription;
            this.projectImageUrls = projectImageUrls;
        }
    }
}
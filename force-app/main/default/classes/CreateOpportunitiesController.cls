/**
 * Controller class for the Lightning Component used to create opportunities
 */
public with sharing class CreateOpportunitiesController {
    
    @AuraEnabled(cacheable=true)
    public static AccountsResponse getAccounts(Integer page, Integer recordsPerPage, String querySearch){
        if(querySearch==null){
            querySearch='%%';
        }else{
            querySearch='%'+querySearch+'%';
        }
        Integer offset=page*recordsPerPage;
        AccountsResponse response=new AccountsResponse();
        response.accounts=[SELECT Id, Name FROM Account WHERE Name LIKE :querySearch ORDER BY Name LIMIT :recordsPerPage OFFSET :offset];
        response.total_count=[SELECT Count() FROM Account];
        response.number_pages=response.total_count/recordsPerPage;
        return response;
    }

    @AuraEnabled
    public static List<InsertResponse> saveOpportunities(List<Opportunity> opportunities){
        List<InsertResponse> response=new List<InsertResponse>();
        Database.SaveResult[] results = Database.insert(opportunities, false);
        for (Database.SaveResult sr : results) {
            InsertResponse insertResult=new InsertResponse();
            insertResult.success=sr.isSuccess();
            if (sr.isSuccess()) {
                insertResult.id=sr.getId();
            }
            else {
                // Operation failed, so get all errors     
                String error='';          
                for(Database.Error err : sr.getErrors()) {
                    error+=err.getStatusCode() + ': ' + err.getMessage()+'.\n';
                }
                insertResult.error=error;
            }
        }
        return response;
    }

    public class AccountsResponse{
        @AuraEnabled public List<Account> accounts;
        @AuraEnabled public Integer number_pages;
        @AuraEnabled public Integer total_count;
    }

    public class InsertResponse{
        Id id;
        Boolean success;
        String error;
    }
}

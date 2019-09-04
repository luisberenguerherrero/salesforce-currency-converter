/**
 * Controller class for the Lightning Component used to create opportunities
 */
public with sharing class CreateOpportunitiesController {
    
    @AuraEnabled(cacheable=true)    
    /**
     * getAccounts Get the accounts and handle pagination variables
     * @param page Current page in the pagination
     * @param recordsPerPage Number of records to be returned
     * @param querySearch Query param to filter the query and improve the experience
     * @return AccountResponse Returns the Account values and other variables for pagination
     */
    public static AccountsResponse getAccounts(Integer page, Integer recordsPerPage, String querySearch){
        if(querySearch==null){
            querySearch='%%';
        }else{
            querySearch='%'+querySearch+'%';
        }
        Integer offset=(page-1)*recordsPerPage;
        AccountsResponse response=new AccountsResponse();
        response.accounts=[SELECT Id, Name FROM Account WHERE Name LIKE :querySearch ORDER BY Name LIMIT :recordsPerPage OFFSET :offset];
        response.total_count=[SELECT Count() FROM Account WHERE Name LIKE :querySearch];
        if(response.total_count==0){
            response.number_pages=1;
        }
        else{
            response.number_pages=Integer.valueOf(Math.ceil(Decimal.valueOf(response.total_count)/Decimal.valueOf(recordsPerPage)));
        }

        return response;
    }

    @AuraEnabled
    /**
     * saveOpportunities Insert the opportunities selected on the Create Opportunities component
     * @param opportunities List of opportunities to insert
     * @return Returns a list with the results to be shown to the user
     */
    public static List<InsertResponse> saveOpportunities(List<Opportunity> opportunities){
        List<InsertResponse> response=new List<InsertResponse>();
        Database.SaveResult[] results = Database.insert(opportunities, false);
        for (Integer i=0; i<results.size(); i++){
            InsertResponse insertResult=new InsertResponse();
            insertResult.success=results[i].isSuccess();
            insertResult.AccountId=opportunities[i].AccountId;
            insertResult.name=opportunities[i].Name;
            if (results[i].isSuccess()) {
                insertResult.id=results[i].getId();
                
            }
            else {
                // Operation failed, so get all errors     
                String error='';          
                for(Database.Error err : results[i].getErrors()) {
                    error+=err.getStatusCode() + ': ' + err.getMessage()+'.\n';
                }
                insertResult.error=error;
            }
            response.add(insertResult);
        }
        return response;
    }

    public class AccountsResponse{
        @AuraEnabled public List<Account> accounts;
        @AuraEnabled public Integer number_pages;
        @AuraEnabled public Integer total_count;
    }

    public class InsertResponse{
        @AuraEnabled public Id id;
        @AuraEnabled public Id AccountId;
        @AuraEnabled public String name;
        @AuraEnabled public Boolean success;
        @AuraEnabled public String error;
    }
}

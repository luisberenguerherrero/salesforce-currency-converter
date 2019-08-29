/**
 * Controller class for the Lightning Component used to create opportunities
 */
public with sharing class CreateOpportunitiesController {
    
    @AuraEnabled(cacheable=true)
    public static AccountsResponse getAccounts(Integer page, Integer recordsPerPage){
        AccountsResponse response=new AccountsResponse();
        response.accounts=[SELECT Id, Name FROM Account LIMIT :recordsPerPage OFFSET :page];
        response.total_count=[SELECT Count() FROM Account];
        response.number_pages=response.total_count/recordsPerPage;
        return response;
    }

    public class AccountsResponse{
        List<Account> accounts;
        Integer number_pages;
        Integer total_count;
    }
}

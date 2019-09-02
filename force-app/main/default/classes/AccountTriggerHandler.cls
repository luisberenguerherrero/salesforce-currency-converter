/**
 * Handler class for the Account trigger. In this class we manage the
 * trigger recursivity and the desired trigger logic
 */
public with sharing class AccountTriggerHandler {
    //Trigger execution check variable
    public static Boolean runOnce = true;

    /**
     * onAfterInsert Here we iterate the inserted accounts and call to updateAccountRevenueInBitcoins
     * to update the Annual_Revenue_in_Bitcoin__c field on the desired accounts
     * @param newMapAccount Map from the trigger with the inserted accounts
     */
    public void onAfterInsert(Map<Id, Account> newMapAccount){
        AccountTriggerHandler.runOnce = false;

        Set<Id> accountsToUpdate=new Set<Id>();

        for(Account newAccount:newMapAccount.values()){
            if(newAccount.AnnualRevenue!=null){
                accountsToUpdate.add(newAccount.Id);
            }
        }

        if(accountsToUpdate.size()>0){
            BitcoinToUSDConvertor.updateAccountRevenueInBitcoins(accountsToUpdate);
        }

        AccountTriggerHandler.runOnce = true;
    }
          
    /**
     * onAfterUpdate Here we iterate the updated accounts and call to updateAccountRevenueInBitcoins
     * to update the Annual_Revenue_in_Bitcoin__c field on the desired accounts
     * @param newMapAccount Map from the trigger with the values of the updated accounts
     * @param oldMapAccount Map from the trigger with the previous values of the updated accounts
     */
    public void onAfterUpdate(Map<Id, Account> newMapAccount, Map<Id, Account> oldMapAccount){
        AccountTriggerHandler.runOnce = false;

        Set<Id> accountsToUpdate=new Set<Id>();

        for(Account newAccount:newMapAccount.values()){
            Account oldAccount=oldMapAccount.get(newAccount.Id);
            if(newAccount.AnnualRevenue!=null && newAccount.AnnualRevenue!=oldAccount.AnnualRevenue){
                accountsToUpdate.add(newAccount.Id);
            }
        }

        if(accountsToUpdate.size()>0){
            BitcoinToUSDConvertor.updateAccountRevenueInBitcoins(accountsToUpdate);
        }

        AccountTriggerHandler.runOnce = true;
    }
}

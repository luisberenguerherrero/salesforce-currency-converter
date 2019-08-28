public with sharing class AccountTriggerHandler {
    //Trigger execution check variable
    public static Boolean runOnce = true;

    //On after insert
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
          
    //On after update
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

trigger AccountTrigger on Account (after insert, after update) {
    AccountTriggerHandler handler = new AccountTriggerHandler();

    //Check trigger context variables, recursivity and if the process is triggered from an asynchronous method
    if(Trigger.isAfter && Trigger.isInsert && AccountTriggerHandler.runOnce && !System.isFuture()){
        handler.onAfterInsert(Trigger.newMap);
    }

    //Check trigger context variables, recursivity and if the process is triggered from an asynchronous method
    else if(Trigger.isAfter && Trigger.isUpdate && AccountTriggerHandler.runOnce && !System.isFuture()){
        handler.onAfterUpdate(Trigger.newMap, Trigger.oldMap);
    }
}
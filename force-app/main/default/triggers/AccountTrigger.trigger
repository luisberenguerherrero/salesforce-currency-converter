trigger AccountTrigger on Account (after insert, after update) {
    AccountTriggerHandler handler = new AccountTriggerHandler();

    if(Trigger.isAfter && Trigger.isInsert && AccountTriggerHandler.runOnce && !System.isFuture()){
        handler.onAfterInsert(Trigger.newMap);
    }

    else if(Trigger.isAfter && Trigger.isUpdate && AccountTriggerHandler.runOnce  && !System.isFuture()){
        handler.onAfterUpdate(Trigger.newMap, Trigger.oldMap);
    }
}
trigger ContactTrigger on Contact (before insert) {
    if(Trigger.IsBefore && Trigger.IsInsert) {
        if(ContactTriggerHelper.isTriggerExecuted == false) {
            ContactTriggerHelper.isTriggerExecuted = true;
            ContactTriggerHelper.beforeInsert(Trigger.New);
        }
        
    }
}
public with sharing class SearchableDualListboxController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccount(){
        return [SELECT Id, Name FROM Account];
    } 
}

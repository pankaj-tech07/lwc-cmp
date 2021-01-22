/*
 * Name : AccountContactRelation
 * Date : 20/01/2021	
 * Auth : PanKaj
 * Des : This class is use to Add multiple Account in Contact at single click.
*/
public with sharing class AccountContactRelationController {
    //This method is use to get the all picklist value from AccountContactRelation
    @AuraEnabled(cacheable=true)
    public static List<String> getRolesListValuesIntoList(){
       List<String> rolesPickListValuesList= new List<String>();
		Schema.DescribeFieldResult fieldResult = AccountContactRelation.Roles.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry pickListVal : ple){
			rolesPickListValuesList.add(pickListVal.getLabel());
		}     
		return rolesPickListValuesList;
    }
    //This method is use to get the all Account
    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getAccount(String contactRecId, String searchedValue, List<String> selectedRecId) {
        Set<Id> accountId = new Set<Id>();
        List<AccountContactRelation> accContactRelList = [SELECT ContactId, AccountId FROM AccountContactRelation WHERE ContactId =:contactRecId];
        /*if(accContactRelList != null && !accContactRelList.isEmpty()){
            accountId = accContactRelList.get(0).AccountId;
        }*/
        for(AccountContactRelation accCon : accContactRelList){
            accountId.add(accCon.AccountId);
        }
        system.debug('accountId'+accountId);
	    List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        if(selectedRecId == null) selectedRecId = new List<String>();
		if(String.isNotEmpty(searchedValue)) {
            String query = 'SELECT Id, Name FROM Account WHERE Name LIKE \'%' + searchedValue.trim() + '%\' AND Id NOT IN: selectedRecId AND Id != :accountId';
            system.debug(query);
            for(Account acc : Database.Query(query)) {
                sObjectResultList.add(new SObjectResult(acc.Name, acc.Id));
            }
        }
        return sObjectResultList;
    }
    //This method is use to save the record in AccountContactRelation
    @AuraEnabled
    public static List<AccountContactRelation> saveContactAccount(List<AccountContactRelation> accountContactRelations){
    	system.debug('accountContactRelations==>'+accountContactRelations);
        if(accountContactRelations.size() > 0){
            insert accountContactRelations;
        }
        return accountContactRelations;
    }
    
    //Wrapper Class
    public class SObjectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;
        
        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
        public SObJectResult() {
          
        }
    }
}

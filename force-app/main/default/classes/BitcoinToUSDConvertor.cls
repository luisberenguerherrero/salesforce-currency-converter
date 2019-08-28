public class BitcoinToUSDConvertor{ 
 
    @TestVisible private Decimal ValueOfOneBitcoinInUSD; 
    
    public BitcoinToUSDConvertor(){ 
        ValueOfOneBitcoinInUSD=getValueFromBitpay();
    }
    
    public Decimal getTheValueOfOneBitcoinInUSD(){
        return ValueOfOneBitcoinInUSD;
    }

    private static Decimal getValueFromBitpay(){

        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Bitpay/api/rates/');
        req.setMethod('GET');
        if(Test.isRunningTest()){
            Test.setMock(HttpCalloutMock.class, new BitpayHttpCalloutMock());
        }
        HttpResponse res = http.send(req);

        System.debug('Body:');
        System.debug(res.getBody());
        Map<String, Decimal> exchangeRatesMap=ExchangeRate.parseToMap(res.getBody());
        System.debug('Exchange rate:');
        System.debug(exchangeRatesMap.get('USD'));

        return exchangeRatesMap.get('USD');
    }

    @future(callout=true)
    public static void updateAccountRevenueInBitcoins(Set<Id> accountIds){
        Decimal valueOfBitcoinInUSD=getValueFromBitpay();
        List<Account> accounts=[SELECT Id, AnnualRevenue, Annual_Revenue_in_Bitcoin__c FROM Account WHERE Id in :accountIds];
        for(Account a:accounts){
            a.Annual_Revenue_in_Bitcoin__c=a.AnnualRevenue/valueOfBitcoinInUSD;
        }
        update accounts;
    }
}
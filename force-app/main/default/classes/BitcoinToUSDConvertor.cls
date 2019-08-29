/**
 * Class to handle the conversion between Bitcoins and USD
 */
 public class BitcoinToUSDConvertor{ 
 
    @TestVisible private Decimal ValueOfOneBitcoinInUSD;
    
    /**
     * BitcoinToUSDConvertor Instantiates the class assigning a value to the ValueOfOneBitcoinInUSD variable
     */
    public BitcoinToUSDConvertor(){ 
        ValueOfOneBitcoinInUSD=getValueFromBitpay();
    }

    /**
     * getTheValueOfOneBitcoinInUSD
     * @return Returns the value of ValueOfOneBitcoinInUSD variable for the current instance
     */
    public Decimal getTheValueOfOneBitcoinInUSD(){
        return ValueOfOneBitcoinInUSD;
    }

    /**
     * getValueFromBitpay Makes a callout to the Bitpay API to retrieve the exchange rates
     * @return Returns the value of one Bitcoin in USD retrieved from the webservice
     */
    @AuraEnabled(cacheable=true)
    public static Decimal getValueFromBitpay(){
        HttpRequest req = new HttpRequest();

        HttpResponse res;
        req.setEndpoint('callout:Bitpay/api/rates/');
        req.setMethod('GET');

        if(Test.isRunningTest()){
            Test.setMock(HttpCalloutMock.class, new BitpayHttpCalloutMock());
        }

        res = sendRequest(req);
        Map<String, Decimal> exchangeRatesMap=ExchangeRate.parseToMap(res.getBody());

        return exchangeRatesMap.get('USD');
    }

    /**
     * updateAccountRevenueInBitcoins Asynchronous method to be called from the Account Trigger to update the Annual Revenue in Bitcoin value of the accounts in the Set
     * @param accountIds accountIds Accounts where the Annual Revenue in Bitcoin needs to be updated
     */
    @future(callout=true)
    public static void updateAccountRevenueInBitcoins(Set<Id> accountIds){
        Decimal valueOfBitcoinInUSD=getValueFromBitpay();
        List<Account> accounts=[SELECT Id, AnnualRevenue, Annual_Revenue_in_Bitcoin__c FROM Account WHERE Id in :accountIds];
        for(Account a:accounts){
            a.Annual_Revenue_in_Bitcoin__c=a.AnnualRevenue/valueOfBitcoinInUSD;
        }
        update accounts;
    }

    /**
     * sendRequest Helper method to send the request to the external webservice and keep the main function clean
     * @param req A request constructed ready to send
     * @return Returns the HttpRepsonse of the callout
     */
    private static HttpResponse sendRequest(HttpRequest req){
        Http http=new Http();
        HttpResponse res;
        try{
            res = http.send(req);
            if(res.getStatusCode()<200 || res.getStatusCode()>299){
                System.debug('Error code: '+res.getStatusCode());
                System.debug('Message: '+res.getBody());
                AssignmentException ex=new AssignmentException('Error retrieving the exchange rate, try later or contact with your administrator (UNEXPECTED STATUS)');
                throw ex;
            }
        }
        catch (System.CalloutException e){
            System.debug('Error in webservice:' + e.getMessage());
            AssignmentException ex=new AssignmentException('Error retrieving the exchange rate, try later or contact with your administrator (CALLOUT ERROR)');
            throw ex;
        }
        return res;
    }
}
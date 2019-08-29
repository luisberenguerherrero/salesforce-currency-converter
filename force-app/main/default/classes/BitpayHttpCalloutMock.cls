/**
 * Mock response for the Bitpay webservice. Used for testing purposes
 */
@isTest
public with sharing class BitpayHttpCalloutMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HTTPResponse();
        res.setHeader('Content-Type', 'application/JSON');
        ExchangeRate usdExchange=new ExchangeRate();
        usdExchange.code='USD';
        usdExchange.name='United States Dollar';
        usdExchange.rate=246.4867;
        String responseBody=JSON.serialize(new List<ExchangeRate>{usdExchange});
        res.setBody(responseBody);
        res.setStatusCode(200);
        return res;
    }
}

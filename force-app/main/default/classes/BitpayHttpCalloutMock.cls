@isTest
public with sharing class BitpayHttpCalloutMock implements HttpCalloutMock {
    public HttpResponse respond(HttpRequest req) {
        // Create a fake response.
        // Set response values, and
        // return response.
        return new HttpResponse();
    }
}

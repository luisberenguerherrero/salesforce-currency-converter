@isTest 
private class BitcoinToUSDConvertorTest {    
    static testMethod void constructorGetsTheValueOfOneValueOfOneBitcoinInUSDFromTheApiTest(){ 
        Test.startTest(); 
        BitcoinToUSDConvertor class_instance = new BitcoinToUSDConvertor(); 
        Test.stopTest();        
        System.assertEquals(246.4867, class_instance.ValueOfOneBitcoinInUSD);   
    }
}
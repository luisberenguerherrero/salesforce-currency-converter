public class BitcoinToUSDConvertor{ 
 
    @TestVisible private Decimal ValueOfOneBitcoinInUSD; 
    
    public BitcoinToUSDConvertor(){ 
        getTheValueOfOneBitcoinInUSD(); 
    } 
    
    private void getTheValueOfOneBitcoinInUSD(){
        ValueOfOneBitcoinInUSD=246.4867;
    } 
}
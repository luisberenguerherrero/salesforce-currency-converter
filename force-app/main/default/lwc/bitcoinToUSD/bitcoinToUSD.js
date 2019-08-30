import { LightningElement, track, wire } from "lwc";
import getOneBitcoinUSDValueFromBitpay from "@salesforce/apex/BitcoinToUSDConvertor.getValueFromBitpay";
import getOneBitcoinUSDValueFromDatabase from "@salesforce/apex/BitcoinToUSDConvertor.getValueFromDatabase";
import saveCurrencyValue from "@salesforce/apex/BitcoinToUSDConvertor.saveValue";

export default class BitcoinToUSD extends LightningElement {
  @wire(getOneBitcoinUSDValueFromBitpay)
  wiredValue({ error, data }) {
    if (data) {
      this.oneBitcoinUSDValue = data;
      this.usdValue=this.oneBitcoinUSDValue;
      this.lastUpdatedDate=new Date().toLocaleString();
      this.saveData();
      this.error = undefined;
    } else if (error) {
      getOneBitcoinUSDValueFromDatabase().then(result=>{
        this.oneBitcoinUSDValue = result.Value__c;
        this.usdValue=this.oneBitcoinUSDValue;
        this.lastUpdatedDate=new Date(result.LastModifiedDate).toLocaleString();
        this.error = undefined;
      }).catch(()=>{
        this.error = 'Unknown error';
        if (Array.isArray(error.body)) {
          this.error = error.body.map(e => e.message).join(', ');
        } else if (typeof error.body.message === 'string') {
          this.error = error.body.message;
        }
      });
    }
  }
  @track oneBitcoinUSDValue;
  @track error;
  @track bitcoinValue = 1;
  @track usdValue;
  @track lastUpdatedDate;

  handleUSDChange(event) {
    console.log(event.target);
    let usdInput = event.target.value;
    console.log(usdInput.length);
    console.log(usdInput[usdInput.length-1]);
    if(usdInput.length===0){this.bitcoinValue=0;this.usdValue='';}
    else if(usdInput[usdInput.length-1] >= '0' && usdInput[usdInput.length-1] <= '9'){
      this.usdValue = usdInput;
      this.bitcoinValue = Math.round((usdInput / this.oneBitcoinUSDValue)*1000000)/1000000;
    }
  }

  handleBitcoinChange(event) {
    let bitcoinInput = event.target.value;
    console.log(bitcoinInput.length);
    console.log(bitcoinInput[bitcoinInput.length-1]);
    if(bitcoinInput.length===0){this.usdValue=0;this.bitcoinValue='';}
    else if(bitcoinInput[bitcoinInput.length-1] >= '0' && bitcoinInput[bitcoinInput.length-1] <= '9'){
      this.bitcoinValue = bitcoinInput;
      this.usdValue = Math.round(bitcoinInput * this.oneBitcoinUSDValue * 100) / 100;
    }
  }

  get oneUSDBitcoinValue() {
    return 1 / this.oneBitcoinUSDValue;
  }

  saveData(){
    saveCurrencyValue({currencyName : 'USD', value: this.oneBitcoinUSDValue}).then(()=>{
    });
  }
}

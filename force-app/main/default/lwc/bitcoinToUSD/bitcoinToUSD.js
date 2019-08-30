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
    this.usdValue=event.target.value;
    let usdNumber=this.usdValue.length===0?0:parseFloat(event.target.value.replace(',', '.'));
    this.bitcoinValue = Math.round((usdNumber / this.oneBitcoinUSDValue)*1000000)/1000000;
  }

  handleBitcoinChange(event) {
    this.bitcoinValue=event.target.value;
    let bitcoinNumber=this.bitcoinValue.length===0?0:parseFloat(event.target.value.replace(',', '.'));
    this.usdValue = Math.round(bitcoinNumber * this.oneBitcoinUSDValue * 100) / 100;
  }

  get oneUSDBitcoinValue() {
    return 1 / this.oneBitcoinUSDValue;
  }

  saveData(){
    saveCurrencyValue({currencyName : 'USD', value: this.oneBitcoinUSDValue}).then(()=>{
    });
  }
}
